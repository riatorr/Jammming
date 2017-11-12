import React from 'react';
import './PlayList.css';
import TrackList from '../../Components/TrackList/TrackList';

class PlayList extends React.Component {
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  renderClearButton() {
    if (this.props.status != null) {
      return <a className="Playlist-save" onClick={this.props.onClear}>CLEAR PLAYLIST</a>;
    } else {
      return;
    }
  }

  renderShareButton() {
    if (this.props.status === 201) {
      return <a className="Playlist-save" onClick={this.props.onShare}>SHARE PLAYLIST</a>;
    } else {
      return;
    }
  }

  renderShareURL() {
    if (this.props.shareURL) {
      return (
          <div className="Playlist-share">
            <div className="Playlist-share-title">Your Share Link</div>
            {this.props.shareURL}
          </div>
        );
    } else {
      return;
    }
  }

  handleNameChange(event) {
    const name = event.target.value;
    this.props.onNameChange(name);
  }

  render() {
    return (
      <div className="Playlist">
        <input defaultValue={'New Playlist'} onChange={this.handleNameChange}/>
        <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true}/>
        <a className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
        {this.renderClearButton()}
        {this.renderShareButton()}
        {this.renderShareURL()}
      </div>
    )
  }
};

export default PlayList;