import React, { Component } from 'react';
import { View, FlatList, Text, Alert } from 'react-native';
import { ListItem} from 'react-native-elements'; 
import { connect } from 'react-redux';
import Swipeout from 'react-native-swipeout';
import * as Animatable from 'react-native-animatable';

import { deleteFavorite } from '../redux/actions';
import {Loading} from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';

const mapStateToProps = state => ({
    dishes: state.dishes,
    favorites: state.favorites
})

class Favorites extends Component {
    static navigationOptions = {
        title: 'My Favorites'
    }
    render() {
        const {navigate} = this.props.navigation;
        
        const renderMenuItem = ({ item, index}) => {
            const rightButton = [ //the swipeout takes an array of buttons
                //each button can be configured like below
                {
                    text: 'Delete',
                    type: 'delete',
                    onPress: ()=> {
                       Alert.alert(
                           'Delete Favorite?',
                           'Are you sure you wish to delete favorite dish ' + item.name + '?',
                           //takes array of buttons
                           [    
                               //cancel button configuration
                               {
                                    text:'Cancel', 
                                    onPress: () => console.log('Not deleted'),
                                    style: 'cancel'
                                },
                                //delete button configuration
                                {
                                    text: 'ok',
                                    onPress: () => this.props.deleteFavorite(item.id)
                                }
                           ],
                           //user has explicitly press the cancel button to cancel the delete operation
                           {cancelable: false}
                       )
                    } 
                }
                
            ]
            return(
                <Swipeout right = {rightButton} autoClose = {true}>
                    <Animatable.View animation = "fadeInRightBig" duration = {2000} >
                        <ListItem
                            key = {index}
                            title = {item.name}
                            subtitle = {item.description}
                            hideChevron = {true}
                            onPress = {() => navigate('Dishdetail', {dishId: item.id})}
                            leftAvatar = {{source: {uri : baseUrl + item.image}}}
                            />
                    </Animatable.View>
                </Swipeout>

            )
        }

        if (this.props.dishes.isLoading){
            return(
                <Loading />
            )
        }
        else if (this.props.dishes.errMess){
            return (
                <View>
                    <Text>{this.props.dishes.errMess}</Text>
                </View>
            )
        }
        else {
            return(
                <FlatList
                    data = {this.props.dishes.dishes.filter(dish => (this.props.favorites.includes(dish.id)))}
                    renderItem = {renderMenuItem}
                    keyExtractor = {item => item.id.toString()}
                    />
            )
        }
    }
}

export default connect(mapStateToProps,{deleteFavorite})(Favorites);
