import React from 'react';
import { Text, View, ScrollView, FlatList,StyleSheet, Modal, Button, Alert, PanResponder } from 'react-native';
import { Card, Icon, Rating, Input} from 'react-native-elements';
import {connect} from 'react-redux';
import {baseURL} from '../shared/baseURL';
import {postFavorite, postComment, addComment} from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    addComment:(dishId, rating, comment, author) =>dispatch(addComment(dishId, rating, comment, author)),
    postComment:(dishId, rating, comment, author) => dispatch(postComment(dishId, rating, comment, author))
})

function RenderDish(props) {
    const dish = props.dish;
    
    handleViewRef = ref => this.view = ref;

    const recognizeDrag = ({moveX, moveY, dx, dy}) => {
        if(dx < -200)
            return true;
        else false;
    }

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderGrant: () => {
            this.view.rubberBand(1000).then(endState => console.log(endState.finished ? 'finished' : 'cancelled'))
        },  
        onPanResponderEnd: (e, gestureState) => {
            if (recognizeDrag(gestureState))
                Alert.alert(
                    'Add to favorites',
                    'Are you sure you wish to add ' + dish.name +' to your favorites ?',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel pressed'),
                            style: 'cancel'
                        },
                        {
                            text: 'Ok',
                            onPress: () => props.favorite ? console.log('Already favorite') : props.onPress()
                        }
                    ],
                    {cancelable: false}
                )
            return true;
        }
    });

    if (dish != null) {
        return(
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000} 
            ref={this.handleViewRef}
            {...panResponder.panHandlers}>
                <Card
                featuredTitle={dish.name}
                image={{uri: baseURL + dish.image}}>
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>
                    <View style={{flex:1,
                                flexDirection: 'row',
                                alignItems:'center',
                                justifyContent: 'center'}}>
                        <Icon
                        raised
                        reverse
                        name={ props.favorite ? 'heart' : 'heart-o'}
                        type='font-awesome'
                        color='#f50'
                        onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                        />
                        <Icon
                        raised
                        reverse
                        name = {'pencil'}
                        type = 'font-awesome'
                        color = '#512DA8'
                        onPress = {() => props.onPressComment()}
                        /> 
                    </View>
                </Card>
            </Animatable.View>
        );
    }
    else {
        return(<View></View>);
    }
}


function RenderComments(props) {
    const comments = props.comments;

    const renderCommentItems = ({item, index}) => {
        return(
            <View key={index} style={{margin:10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Rating
                    type='star'
                    imageSize={15} readonly startingValue={item.rating}
                    style={{alignSelf:'flex-start'}}
                />
                <Text style={{fontSize:12}}>{'--' + item.author + ', ' + new Date(item.date).toUTCString()}</Text>
            </View>
        );
    }
    return(
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
            <Card title="Comments">
            <FlatList
                data={comments}
                renderItem={renderCommentItems}
                keyExtractor={item => item.id.toString()}/>
        </Card>
        </Animatable.View>
    );
}

class Dishdetail extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            rating: 3,
            author: '',
            comment: '',
            showModal: false
        }
    }

    toggleModal() {
        this.setState({showModal: !this.state.showModal})
    }

    handleSubmit(dishId) {
        console.table(JSON.stringify(this.state));
        this.toggleModal();
        this.props.postComment(dishId, this.state.rating, this.state.comment, this.state.author);
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    static navigationOptions = {
        title: 'Dish Details'
    }

    render(){
        const dishId = this.props.navigation.getParam('dishId','');
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    onPressComment={()=> this.toggleModal()}
                    />
                
                <Modal animation = {"slide"} transparent = {false}
                        visible = {this.state.showModal}
                        onDismiss = {() => this.toggleModal()}
                        onRequestClose = {() => this.toggleModal}>
                    <View style = {style.modal}>
                        <View>
                            <Rating showRating
                                    type = "star"
                                    fractions = {0}
                                    startingValue = {this.state.rating}
                                    imageSize = {40}
                                    style={style.modalItem}
                                    onFinishRating={(rating) => this.setState({rating: rating}) }
                                    />
                        </View>
                        <View>
                            <Input
                            placeholder='Author'
                            leftIcon={
                                <Icon
                                name='user-o'
                                type = 'font-awesome'
                                size={24}
                                />
                            }
                            onChangeText = {(author) => this.setState({author: author})}
                            />
                        </View>
                        <View>
                            <Input
                                placeholder = "Comment"
                                leftIcon = {
                                    <Icon
                                    name = 'comment-o'
                                    type = 'font-awesome'
                                    size = {24}
                                    />
                                }
                                onChangeText = {(comment) => this.setState({comment: comment})}
                            />
                        </View>
                        <View style={{margin:20}}>
                            <Button color = "#512DA8"
                                    title = "Submit"
                                    onPress = {() => {this.handleSubmit(dishId)}}
                                    />
                        </View>
                        <View style={{margin:20}}>
                            <Button onPress = {() => { this.toggleModal()}}
                                    color = "#989898"
                                    title = "Close"
                                    />
                        </View> 
                    </View>       
                </Modal>
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
            </ScrollView>
        );
    }
}

const style = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalItem: {
        marginBottom: 20
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);