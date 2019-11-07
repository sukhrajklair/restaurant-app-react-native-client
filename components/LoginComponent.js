import React, { Component } from 'react';
import { View, StyleSheet, Text, ScrollView, Image } from 'react-native';
import { Icon, Input, CheckBox, Button } from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { createBottomTabNavigator} from 'react-navigation';
import { connect } from 'react-redux';

import { baseUrl } from '../shared/baseUrl';
import * as actions from '../redux/actions';

const mapStateToProps = state => ({
    auth: state.auth
});

class LoginTab extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            remember: false
        }
    }

    componentDidMount() {
        SecureStore.getItemAsync('userinfo')
            .then((userdata) => {
                let userinfo = JSON.parse(userdata);
                if (userinfo) {
                    this.setState({username: userinfo.username});
                    this.setState({password: userinfo.password});
                    this.setState({remember: true})
                }
            })
    }

    static navigationOptions = {
        title: 'Login',
        tabBarIcon: ({tintcolor}) => (
            <Icon
                name= 'sign-in'
                type = 'font-awesome'
                size = {24}
                iconStyle = {{color: tintcolor}}
                />
        )
    };

    handleLogin() {
        this.props.loginUser({
            username: this.state.username,
            password: this.state.password
        })

        if (this.state.remember)
            SecureStore.setItemAsync('userinfo', JSON.stringify({username: this.state.username, password: this.state.password}))
                .catch((error) => console.log('Could not save user info', error));
        else
            SecureStore.deleteItemAsync('userinfo')
                .catch((error) => console.log('Could not delete user info', error));

    }

    render() {
        //if a user is already signed in then show a logout button
        if (this.props.auth.isAuthenticated) {
            return(
                <View style={styles.container}>
                    <Text>Currently logged in as {this.props.auth.user.username}</Text>
                    <View style={styles.formButton}>
                        <Button
                            onPress={this.props.logoutUser}
                            title="Log Out"
                            buttonStyle = {{backgroundColor : '#512DA8'}}
                            />
                    </View>
                </View>
            );
        }
        //if there is an error, show the error and a button to navigate back to Login component
        else if (this.props.auth.errMess) {
            return(
                <View style={styles.container}>
                    <Text>Error: {this.props.auth.errMess}</Text>
                    <View style={styles.formButton}>
                        <Button
                            onPress={()=>{
                                this.props.resetLogin();
                                this.props.navigation.navigate('Login')
                                }
                            }
                            title="Try Again"
                            buttonStyle = {{backgroundColor : '#512DA8'}}
                            />
                    </View>
                </View>
            );
        }
        else{
            return (
                <View style={styles.container}>
                    <Input
                        placeholder="Username"
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        onChangeText={(username) => this.setState({username})}
                        value={this.state.username}
                        containerStyle={styles.formInput}
                        />
                    <Input
                        placeholder="Password"
                        leftIcon={{ type: 'font-awesome', name: 'key' }}
                        onChangeText={(password) => this.setState({password})}
                        value={this.state.password}
                        containerStyle={styles.formInput}
                        />
                    <CheckBox title="Remember Me"
                        center
                        checked={this.state.remember}
                        onPress={() => this.setState({remember: !this.state.remember})}
                        containerStyle={styles.formCheckbox}
                        />
                    <View style={styles.formButton}>
                        <Button
                            onPress={() => this.handleLogin()}
                            title="Login"
                            icon = {<Icon name='sign-in' type = 'font-awesome' color = 'white' size = {24} />}
                            buttonStyle = {{backgroundColor : '#512DA8'}}
                            />
                    </View>
                    <View style={styles.formButton}>
                        <Button
                            onPress={() => this.props.navigation.navigate('Register')}
                            title="Register"
                            clear
                            icon = {<Icon name='user-plus' type = 'font-awesome' color = 'blue' size = {24} />}
                            titleStyle = {{color : 'blue'}}
                            />
                    </View>
                </View>
            );
        }
    }
}

class RegisterTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            firstname: '',
            lastname: '',
            email: '',
            remember: false,
            imageUrl: baseUrl + 'images/logo.png'
        }
    }

    static navigationOptions = {
        title: 'Register',
        tabBarIcon: ({tintcolor}) => (
            <Icon
                name= 'user-plus'
                type = 'font-awesome'
                size = {24}
                iconStyle = {{color: tintcolor}}
                />
        )
    };


    getImageFromCamera = async () => {
        const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
        const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        
        if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted'){
            let capturedImage = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4,3]
            });
            if (!capturedImage.cancelled){
                this.processImage( capturedImage.uri );
            }
        }
    }

    getImageFromGallery = async () => {
        const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
        const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        
        if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted'){
            let capturedImage = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4,3]
            });
            if (!capturedImage.cancelled){
                this.processImage( capturedImage.uri );
            }
        }
    }

    processImage = async (imageUri) => {
        let processedImage = await ImageManipulator.manipulateAsync(
            imageUri, 
            [
                {resize: {width: 400}} //only providing width, height will be automatically adjusted to maintain the aspect ration of 4:3
            ],
            {format: 'png'}
        );
        this.setState({imageUrl: processedImage.uri})
    }

    handleRegister(){
        console.log(JSON.stringify(this.state));
        if (this.state.remember)
            SecureStore.setItemAsync('userinfo', JSON.stringify({username: this.state.username, password: this.state.password}))
                .catch((error) => console.log('Could not save user info', error));

    }
    render() {
        return(
            <ScrollView>
                <View style={styles.container}>
                    <View style = {styles.imageContainer}>
                        <Image
                            source = {{uri:this.state.imageUrl}}
                            loadingIndicatorSource = {require('./images/logo.png')}
                            style = {styles.image}
                        />
                        <Button
                            title = 'Camera'
                            onPress = {this.getImageFromCamera}
                        />
                        <Button
                            title = 'Gallery'
                            onPress = {this.getImageFromGallery}
                        />
                    </View>
                    <Input
                        placeholder="Username"
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        onChangeText={(username) => this.setState({username})}
                        value={this.state.username}
                        containerStyle={styles.formInput}
                    />
                    <Input
                        placeholder="Password"
                        leftIcon={{ type: 'font-awesome', name: 'key' }}
                        onChangeText={(password) => this.setState({password})}
                        value={this.state.password}
                        containerStyle={styles.formInput}
                    />
                    <Input
                        placeholder="First Name"
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        onChangeText={(firstname) => this.setState({firstname})}
                        value={this.state.firstname}
                        containerStyle={styles.formInput}
                    />
                    <Input
                        placeholder="Last Name"
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        onChangeText={(lastname) => this.setState({lastname})}
                        value={this.state.lastname}
                        containerStyle={styles.formInput}
                    />
                    <Input
                        placeholder="Email"
                        leftIcon={{ type: 'font-awesome', name: 'envelope-o' }}
                        onChangeText={(email) => this.setState({email})}
                        value={this.state.email}
                        containerStyle={styles.formInput}
                    />
                    <CheckBox title="Remember Me"
                        center
                        checked={this.state.remember}
                        onPress={() => this.setState({remember: !this.state.remember})}
                        containerStyle={styles.formCheckbox}
                    />
                    <View style={styles.formButton}>
                        <Button
                            onPress={() => this.handleRegister()}
                            title="Register"
                            icon = {<Icon name='user-plus' type = 'font-awesome' color = 'white' size = {24} />}
                            buttonStyle = {{backgroundColor : '#512DA8'}}
                            />
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const Login = createBottomTabNavigator({
    Login: connect(mapStateToProps,actions)(LoginTab),
    Register: RegisterTab
},{
    tabBarOptions:{
        activeBackgroundColor: '#9575CD',
        inactiveBackgroungColor: '#D1C4E9',
        activeTintColor: 'white',
        inactiveTintColor: 'gray'
    }
})

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        margin: 20,
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'row',
        margin: 20,
        justifyContent: 'space-around'
    },
    image: {
        margin: 10,
        width: 80,
        height: 60
    },
    formInput: {
        margin: 20
    },
    formCheckbox: {
        margin: 20,
        backgroundColor: null
    },
    formButton: {
        height: 30,
        margin: 60
    }
});

export default Login;