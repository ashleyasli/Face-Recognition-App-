/*
// import module:
// react-particles-js: For background
// Clarifai 
*/
import React, { Component } from 'react';
import Particles from 'react-particles-js';
import './App.css';

//import components
import Navigation from '../components/Navigation/Navigation';
import Register from '../components/Register/Register';
import Signin from '../components/Signin/Signin';
import FaceRecognition from '../components/FaceRecognition/FaceRecognition';
import Logo from '../components/Logo/Logo';
import ImageLinkForm from '../components/ImageLinkForm/ImageLinkForm';
import Rank from '../components/Rank/Rank';

const particlesOptions = {
  particles: {
    number: {
      value: 350,
      density: {
        enable: true,
        value_area: 1500
                    }
            }
        }
      }

/*
input: change if user input Something
imageURL: imageURL for show
boxs: position array of boxs that record where is the face
route: what page is now 
*/

const initialState = {
  input: '',
        imageUrl: '',
        boxs: [],
        route: 'signin',
        isSignedIn: false,
        user: {
          id: '',
          name: '',
          email:'',
          entries: 0,
          joined: ''
        }
}

class App extends Component {
    constructor() {
      super();
      this.state = initialState;        
    }

    loadUser =(data) => {
      this.setState( { user: {
        id: data.id,
        name: data.name,
        email:data.email,
        entries: data.entries,
        joined: data.joined
     }})
}
    //generate the box position array
    calculateFaceLocation = (data) => {
      const clarifaiFace = data.outputs[0].data.regions;
      const image = document.getElementById('inputImage');
      const width = Number(image.width);
      const height = Number(image.height);
      return clarifaiFace.map(value => this.boxsArray(value, width, height));
  }

  //calculate the box position in the image
  boxsArray = (value, width, height) => {
    const boxData = value.region_info.bounding_box;
      return {
        leftCol: boxData.left_col * width,
        topRow: boxData.top_row * height,
        rightCol: width - (boxData.right_col * width),
        bottomRow: height - (boxData.bottom_row * height)
      }
    }

    displayFaceBox = (boxs) => {
      this.setState({boxs: boxs});
    }

    onInputChange = (event) => {
      this.setState({input: event.target.value});
    }

    //Query the clarifai API and update the db
    onButtonSubmit = () => {
      this.setState({imageUrl: this.state.input});
        fetch('https://pacific-wave-46677.herokuapp.com/imageurl',{
              method: 'post',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                input: this.state.input
              })
            })
         .then(response => response.json())
         .then(response => {
          if (response) {
            fetch('https://pacific-wave-46677.herokuapp.com/image',{
              method: 'put',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                id: this.state.user.id
              })
            })
              .then(response => response.json())
              .then(count => {
                  this.setState(Object.assign(this.state.user, {entries: count}))
                  })
              .catch(console.log)
          }
              this.displayFaceBox(this.calculateFaceLocation(response))
            })
        .catch(err => console.log(err));   
        }

  onRouteChange = (route) => {
    if (route === 'signout'){
    this.setState(initialState);
  } else if (route === 'home') {
    this.setState({isSignedIn: true});
  } 
  this.setState({route: route});
}

  render() {
    const {isSignedIn,imageUrl,route, boxs } = this.state;
    return (
      <div className = "App">
      <Particles className = 'particles'
        params = {particlesOptions}
      />
      <Navigation isSignedIn={isSignedIn} onRouteChange = {this.onRouteChange}/>
      { route === 'home'       
          ? <div>
             <Logo /> 
             <Rank name={this.state.user.name}
                   entries={this.state.user.entries}/>
             <ImageLinkForm 
                onInputChange = {this.onInputChange} 
                onButtonSubmit = {this.onButtonSubmit} 
                /> 
              <FaceRecognition boxs = {this.state.boxs} imageUrl={imageUrl} /> 
            </div>
            : (
              route === 'signin'
              ? <Signin loadUser={this.loadUser} onRouteChange = {this.onRouteChange}/>
              : <Register  loadUser={this.loadUser} onRouteChange = {this.onRouteChange}/>
              )
        }     
      </div>
     
    );
  }
}

export default App;
