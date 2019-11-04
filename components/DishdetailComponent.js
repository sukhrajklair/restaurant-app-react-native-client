import React, {Component} from 'react';
import { Text, View, ScrollView, FlatList, Modal, Alert, PanResponder, Share } from 'react-native';
import { Card, Icon, Input, Rating, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';

import * as actions from '../redux/actions';
import { baseUrl } from '../shared/baseUrl'

const mapStateToProps = state => ({
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites
})

function RenderDish(props) {

    const dish = props.dish;
    
    const recognizeDrag = ({moveX, moveY, dx, dy}) => {
        //gesture's accumulated distance in horizontal direction is given by dx
        //the value of dx is negative for right to left gestures and vice versa
        //top left corner is (0,0)
        if (dx < -200)
            return 'left'
        else if (dx > 200)
            return 'right'
        else 
            return null
    };

    const panResponder = PanResponder.create({
        //this function is called when a gesture begins on the screen
        onStartShouldSetPanResponder: (e, gestureState) => {
            //returning true indicates that this function will respond to the pan
            return true;
        },
        //called when this PanResponder has been granted the permission to handle the gesture
        onPanResponderGrant: () => {
            //this.view refers to the animatable view component
            //rubberBand(...) method adds an animation to the component
            this.view.rubberBand(1000)
                .then(endState => console.log(endState.finished ? 'finished':'cancelled'))
        },
        onPanResponderEnd: (e,gestureState) => {
            const drag = recognizeDrag(gestureState);
            if (drag === 'left') {
                Alert.alert(
                    'Add to Favorites?',
                    'Are you sure you wish to add this dish to your favorites?',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel pressed'),
                            style: 'cancel'
                        },
                        {
                            text: 'OK',
                            onPress: () => props.favorite ? 
                                console.log('Already favorite')
                                : props.onLikePress()
                        }
                    ]
                )
            }
            else if (drag === 'right') {
                props.onCommentPress();
            }
            return true;
        }

    })

    const shareDish = (title, message,url)=>{
        Share.share({
            title: title,
            message: title + ': ' + message + ' ' + url,
            url: url
        },{
            dialogTitle: 'Share ' + title
        })
    }

    /*this function is passed to the ref props of the Animatable.View component
    the component in turn passes the its own reference to the function
    the reference can then be assigned to a local variable which can then be
    used call various methods on the Animatable.View component such as adding animation*/
    handleViewRef = ref =>  this.view = ref;

    if (dish != null) {
        return(
            <Animatable.View animation = "fadeInDown" duration = {2000} delay={1000} 
            ref =  {this.handleViewRef} 
            {...panResponder.panHandlers}>
                <Card
                featuredTitle={dish.name}
                image={{uri: baseUrl + dish.image}}>
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>
                    <View style = {{flex:1, flexDirection:'row', justifyContent: 'center'}}>
                        <Icon
                            raised
                            reverse
                            name = {props.favorite? 'heart':'heart-o'}
                            type = 'font-awesome'
                            color = '#f50'
                            containerStyle = {{flex:1, margin:5,alignItems: 'flex-end',}}
                            onPress = {() => props.favorite ? 
                                console.log('Already favorite')
                                : props.onLikePress()}
                        />
                        <Icon
                            reverse
                            name = 'pencil'
                            type = 'font-awesome'
                            color = '#512DA8'
                            containerStyle = {{flex:1, margin:5, alignItems: 'center'}}
                            onPress = {() => props.onCommentPress()}
                        />
                        <Icon
                            raised
                            reverse
                            name = 'share'
                            type = 'font-awesome'
                            color = '#512DA8'
                            containerStyle = {{flex:1, margin:5}}
                            onPress = {() => shareDish(dish.name, dish.description, baseUrl+dish.image)}
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

function RenderComments(props){
    
    const comments = props.comments;

    const renderCommentItem = ({item, index})=>{
        return(
            <View key = {index} style = {{margin:10}}>
                <Text style = {{fontSize:14}}>{item.comment}</Text>
                <Text style = {{fontSize:12}}>{item.rating} Stars</Text>
                <Text style = {{fontSize:12}}>{'-- ' + item.author + '. ' + item.date}</Text>
            </View>
        )
    }

    return(
        <Animatable.View animation = "fadeInDown" duration = {2000} delay={1000}>
            <Card title = "Comments">
                <FlatList
                    data = {comments}
                    renderItem = {renderCommentItem}
                    keyExtractor = {item => item.id.toString()}
                />
            </Card>
        </Animatable.View>
    )
}

function NewComment(props){
    return(
        <Modal 
            animationType = {'slide'}
            transparent = {false}
            visible = { props.showModal }
            onDismiss = { () => {props.handleCancel()}
            }
            onRequestClose = { () => {props.handleCancel()}
            }

        >
            <Rating
                showRating
                ratingCount = {5}
                startingValue = {5}
                onFinishRating = { rating => props.onChange('rating',rating)}
                style = {{margin:10}}
                />
            <Input
                placeholder = {'Author'}
                style = {{height:40, fontSize:24}}
                onChangeText = { text => props.onChange('author',text)}
                value = {props.authorValue}
                leftIcon = {
                    <Icon 
                        name = 'user'
                        type = 'font-awesome'
                        size = {24}
                    />
                }
            />
            <Input
                placeholder = {'Comment'}
                multiline
                numberOfLines = {2}
                style = {{fontSize:24}}
                onChangeText = { text => props.onChange('comment',text)}
                value = {props.commentValue}
                leftIcon = {
                    <Icon 
                        name = 'user'
                        type = 'font-awesome'
                        size = {24}
                    />
                }
            />
            <View style = {{flex:1,}}>
                <View style = {{ margin:10, backgroundColor:'steelblue'}} >
                    <Button
                        title = 'Submit'
                        color = '#512DA8'
                        onPress = {()=> props.handleSubmit()}
                        accessibilityLabel = 'Learn more about this purple button'
                    />
                </View>
                <View style = {{ margin:10, backgroundColor:'steelblue'}} >
                    <Button
                        title = 'Cancel'
                        color = 'grey'
                        onPress = {()=> props.handleCancel()}
                        accessibilityLabel = 'Learn more about this purple button'
                    />
                </View>
            </View>
        </Modal>
    )
}

class Dishdetail extends Component {
    constructor(props){
        super(props);
        this.state={
            showModal: false,
            rating:'5',
            author: '',
            comment: '',
        }
    }
    static navigationOptions = {
        title: 'Dish Details'
    };

    toggleModal(){
        this.setState({
            showModal: !this.state.showModal
        })
    }
    resetForm(){
        this.setState({
            showModal: false,
            rating:'5',
            author: '',
            comment: '',
        })
    }
    handleSubmit(dishId){
        console.log(JSON.stringify(this.state))
        const {_,...commentData} = this.state;
        this.props.postComment({...commentData, dishId})
        this.resetForm();
        this.toggleModal();
    }
    handleCancel(){
        this.resetForm();
        this.toggleModal();
    }
    handleChange(type,value){
        this.setState({
            [type]:value
        })
    }
    render() {
        const dishId = this.props.navigation.getParam('dishId','');
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[parseInt(dishId)]} 
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onLikePress = {() => this.props.postFavorite(dishId)}
                    onCommentPress = {() => this.toggleModal()}
                    />
                <RenderComments comments = {this.props.comments.comments.filter(comment => comment.dishId === dishId)} />
                <NewComment
                    showModal = {this.state.showModal}
                    handleCancel = {() => this.handleCancel()}
                    handleSubmit = {() => this.handleSubmit(dishId)}
                    onChange = {(type,value) => this.handleChange(type,value)}
                    authorValue = {this.state.author}
                    commentValue = {this.state.comment}
                />
            </ScrollView>
        );
    }
}

export default connect(mapStateToProps, actions)(Dishdetail);