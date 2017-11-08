import React from 'react';
import './App.css';
import SearchBar from '../../Components/SearchBar/SearchBar';
import SearchResults from '../../Components/SearchResults/SearchResults';
import PlayList from '../../Components/PlayList/PlayList';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  // Be sure to update by checking for track id!
  addTrack(track) {
    if (!this.state.playlistTracks.includes(track)) {
      this.state.playlistTracks.push(track);
      this.setState({playlistTracks: this.state.playlistTracks});
    }
  }

  // Be sure to update by checking for track id!
  removeTrack(track) {
    this.state.playlistTracks.forEach(playlistTrack => {
      if (playlistTrack.id === track.id) {
        let trackIndex = this.state.playlistTracks.indexOf(playlistTrack);
        this.state.playlistTracks.splice(trackIndex, 1);
        this.setState({playlistTracks: this.state.playlistTracks});
      }
    });
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(track => track.uri);

    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(playlistName => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      });
    })
    // return trackURIs;
  }

  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults});
    });
    console.log(term);
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <PlayList playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    )
  }
}


export default App;