import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageURL: '',
    };

    this.handleUploadImage = this.handleUploadImage.bind(this);
  }

  makeButtonVisible(){
		document.getElementById("nappi").style.display = 'inline-block';
  }
  loadingScreen(){
		document.getElementById("vastaus").style.display = 'block';
		document.getElementById("analysoidaan").style.display = 'block';
  }

  handleUploadImage(ev) {

  	document.getElementById("kissa").style.display = 'none';
	document.getElementById("eikissa").style.display = 'none';
	document.getElementById("vastaus").style.backgroundColor  = 'Aqua';

    ev.preventDefault();

    const data = new FormData();
    data.append('file', this.uploadInput.files[0]);

    fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: data,
    }).then(function(response) {

	response.text().then(function (text) {
		document.getElementById("analysoidaan").style.display = 'none';

		if(text==="kissa"){
			document.getElementById("kissa").style.display = 'block';
			document.getElementById("vastaus").style.backgroundColor  = 'SpringGreen';
		}else if(text==="eikissa"){
			document.getElementById("eikissa").style.display = 'block';
			document.getElementById("vastaus").style.backgroundColor  = 'FireBrick';
		}else{
			alert("senkin tyhmyri aiheutit errorin");
			document.getElementById("vastaus").style.display = 'none';
		}
});

	});
  }






  render() {
    return (
	<div>
		<h1> oonko tää kissa? 🤔😳</h1>
			<form onSubmit={this.handleUploadImage}>
				<input onChange={this.makeButtonVisible} ref={(ref) => { this.uploadInput = ref; }} type="file" accept=".jpg, .jpeg, .png"/>
				<br />
				<button onClick={this.loadingScreen} id="nappi">Analysoi kuvaa</button>
		</form>
		<div id="filler"></div>
		<div id="vastaus">
		<p id="analysoidaan">Analysoidaan... odota hetki.</p>
		<p id="kissa">oon tää kissa 😃</p>
		<p id="eikissa">en oo tää kissa 😔</p>
		</div>

		<p id="gaming"> Tervetuloa oonko tää kissa? -palveluun! Tällä sivustolla voit siirtää kuvan palvelimelle, ja machine learning blockchain neural network artificial intelligence pöhinäalgoritmi analysoi kuvaa ja tunnistaa, onko siinä kissa. </p>
		<p id="yed">made with react</p>
	</div>
    );
  }
}

export default App;