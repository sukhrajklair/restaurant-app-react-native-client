import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
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

    //navigation options sepecific to this component
    static navigationOptions = {
        title: 'Home'
    }

    render(){
        return(
            <ScrollView>
                <RenderItem 
                    item = {this.props.dishes.dishes.filter(dish=>dish.featured)[0]}
                    isLoading = {this.props.dishes.isLoading}
                    errMess = {this.props.dishes.errMess}
                />
                <RenderItem 
                    item = {this.props.promotions.promotions.filter(promo=>promo.featured)[0]}
                    isLoading = {this.props.promotions.isLoading}
                    errMess = {this.props.promotions.errMess}
                />
                <RenderItem 
                    item = {this.props.leaders.leaders.filter(leader=>leader.featured)[0]}
                    isLoading = {this.props.leaders.isLoading}
                    errMess = {this.props.leaders.errMess}
                />
                
            </ScrollView>
        );
    }
}

export default connect(mapStateToProps)(Home);