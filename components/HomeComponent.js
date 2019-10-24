import React, { Component } from 'react';
import { ScrollView, Text } from 'react-native';
import {Card} from 'react-native-elements';
import { DISHES } from '../shared/dishes';
import {PROMOTIONS} from '../shared/promotions';
import {LEADERS} from '../shared/leaders'

function RenderItem(props){
    const item = props.item;

    if (item){
        return (
            <Card 
                featuredTitle = {item.name}
                featuredSubtitle = {item.designation}
                image = {require('./images/uthappizza.png')}
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
        this.state = {
            dishes: DISHES,
            promotions: PROMOTIONS,
            leaders: LEADERS
        }
    }

    //navigation options sepecific to this component
    static navigationOptions = {
        title: 'Home'
    }

    render(){
        return(
            <ScrollView>
                <RenderItem 
                    item = {this.state.dishes.filter(dish=>dish.featured)}
                />
                <RenderItem 
                    item = {this.state.promotions.filter(promo=>promo.featured)}
                />
                <RenderItem 
                    item = {this.state.leaders.filter(leader=>leader.featured)}
                />
                
            </ScrollView>
        );
    }
}

export default Home;