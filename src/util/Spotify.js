let accessToken;
const clientId = 'b9c98afea6254905a7e6686297229e9b';
const redirectURI = 'https://jamming-react-mts.herokuapp.com/';
// const redirectURI = 'http://localhost:3000/';
let shareURL = '';


let Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken
    }

    const tokenCheck = window.location.href.match(/access_token=([^&]*)/);
    const expirationCheck = window.location.href.match(/expires_in=([^&]*)/);

    if (tokenCheck && expirationCheck) {
      accessToken = tokenCheck[1];
      const expiration = Number(expirationCheck[1]);
      window.setTimeout(() => accessToken = '', expiration * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    }
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {headers: {Authorization: `Bearer ${accessToken}`}}).then(response => response.json()).then(jsonResponse => {
        if (!jsonResponse.tracks) {
          return [];
        }
        return jsonResponse.tracks.items.map(track => {
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }
        })
    });
  },

  savePlaylist(playlistName, trackUris) {
    if(playlistName && trackUris.length > 0) {
      const accessToken = Spotify.getAccessToken();
      const headers = {
        Authorization: `Bearer ${accessToken }`,
        'Content-Type': 'application/json'
      };
      let userID;

      return fetch('https://api.spotify.com/v1/me', {
        headers: headers
      }).then(response => response.json()).then(jsonResponse => {
        userID = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify( {name: playlistName} )
        }).then(response => {
          return response.json();
        }).then(jsonResponse => {
          let playlistID = jsonResponse.id;
          shareURL = `https://open.spotify.com/user/${userID}/playlist/${playlistID}`;
          return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ uris: trackUris })
          }).then(response => {
              return response.status;
            }
          );
        });
      });
    } else {
      return;
    }
  },

  getShareURL() {
    return shareURL;
  }
}

export default Spotify;