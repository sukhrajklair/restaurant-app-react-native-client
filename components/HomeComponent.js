import React, { Component } from 'react';
import { View, Text } from 'react-native';

class Home extends Component {

    //navigation options sepecific to this component
    static navigationOptions = {
        title: 'Home'
    }

    render(){
        return(
            <View><Text>Home</Text></View>
        );
    }
}

export default Home;