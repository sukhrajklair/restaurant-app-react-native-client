import React, { Component } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import {Card} from 'react-native-elements';
import { connect } from 'react-redux';

import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';

const mapStateToProps = state => ({
    dishes: state.dishes,
    promotions: state.promotions,
    leaders: state.leaders
})

function RenderItem(props){
    const item = props.item;

    if (props.isLoading){
        return(
            <Loading />
        );
    }
    else if (props.errMess){
        return(
            <View>
                <Text>{props.errMess}</Text>
            </View>
        );
    }
    else {
        return (
            <Card 
                featuredTitle = {item.name}
                featuredSubtitle = {item.designation}
                image = {{uri: baseUrl + item.image}}
            >
                <Text style = {{margin:10}}>
                    {item.description}
                </Text>
            </Card>
        )
    
    }
}
class Home extends Component {

    constructor(props){
        super(props);
        this.animatedValue = new Animated.Value(0);
    }

    //navigation options sepecific to this component
    static navigationOptions = {
        title: 'Home'
    }

    componentDidMount(){
        this.animate();
    }

    animate(){
        this.animatedValue.setValue(0);
        //this function allows us to change the animatedValue as a function of time
        Animated.timing(
            this.animatedValue,
            //configuration object
            {
                toValue: 8, //increase to value of 8
                duration: 8000, //over duration of 8000 mSec
                easing: Easing.linear //increase the value linearly over the duration
            }
        ).start(() => this.animate())//function passed to the start method is invoked when the animation is finished
    }                              //passing this.animate function will keep the animation going forever
    render(){
        // this method will let us interpolate xpos1 based on the value of animatedValue
        const xpos1 = this.animatedValue.interpolate({
            inputRange: [0, 1, 3, 5, 8],
            outputRange: [1200, 600, 0, -600, -1200]
        });
        const xpos2 = this.animatedValue.interpolate({
            inputRange: [0, 2, 4, 6, 8],
            outputRange: [1200, 600, 0, -600, -1200]
        });
        const xpos3 = this.animatedValue.interpolate({
            inputRange: [0, 3, 5, 7, 8],
            outputRange: [1200, 600, 0, -600, -1200]
        });
        return(
            <View style={{flex:1, flexDirection: 'row', justifyContent: 'center'}}>
                <Animated.View style = {{width : '100%', transform: [{translateX: xpos1}]}} >
                    <RenderItem 
                        item = {this.props.dishes.dishes.filter(dish=>dish.featured)[0]}
                        isLoading = {this.props.dishes.isLoading}
                        errMess = {this.props.dishes.errMess}
                    />
                </Animated.View>
                <Animated.View style = {{width : '100%', transform: [{translateX: xpos2}]}} >
                    <RenderItem 
                        item = {this.props.promotions.promotions.filter(promo=>promo.featured)[0]}
                        isLoading = {this.props.promotions.isLoading}
                        errMess = {this.props.promotions.errMess}
                    />
                </Animated.View>
                <Animated.View style = {{width : '100%', transform: [{translateX: xpos3}]}} >
                    <RenderItem 
                        item = {this.props.leaders.leaders.filter(leader=>leader.featured)[0]}
                        isLoading = {this.props.leaders.isLoading}
                        errMess = {this.props.leaders.errMess}
                    /> 
                </Animated.View>
            </View>
        );
    }
}

export default connect(mapStateToProps)(Home);