import React, { Component } from "react";
import "./bootstrap.min.css";
import "./heroic-features.css";
import "./App.css";
import $ from "jquery";

class SortingButton extends React.Component {
  render() {
    return (
      <div className="row text-center sort-container">
        <div className="col-md-6">
          <button className="btn btn-primary" onClick={this.props.sortAz}>
            Sort a-z
          </button>
        </div>
        <div className="col-md-6 col-md-pull-6">
          <button className="btn btn-primary" onClick={this.props.sortZa}>
            Sort z-a
          </button>
        </div>
      </div>
    );
  }
}

class Button extends React.Component {
  render() {
    return (
      <a href={this.props.href} className="btn btn-primary" type="button">
        {this.props.title}
      </a>
    );
  }
}

class ThumbnailList extends React.Component {
  render() {
    if (this.props.results.length > 0) {
      if (this.props.order === "az") {
        this.props.results.sort(function(a, b) {
          if (a.trackName < b.trackName) return -1;
          if (a.trackName > b.trackName) return 1;
          return 0;
        });
      } else {
        this.props.results.sort(function(a, b) {
          if (b.trackName < a.trackName) return -1;
          if (b.trackName > a.trackName) return 1;
          return 0;
        });
      }
    }

    var list = this.props.results.map(function(thumbnailProps, i) {
      return <Thumbnail key={i} {...thumbnailProps} />;
    });
    return <div className="row text-center">{list}</div>;
  }
}

class Thumbnail extends React.Component {
  render() {
    // console.log("In thumbnail render...");
    // console.log(this.props);
    return (
      <div className="col-xs-3 col-md-3 mb-4">
        <div className="card">
          <img className="card-img-top" src={this.props.artworkUrl100} alt="" />
          <div className="card-body">
            <h4 className="card-title">{this.props.trackName}</h4>
            <h5 className="card-price">Now For {this.props.trackPrice}</h5>
            <p className="card-text">{this.props.artistName}</p>
          </div>
          <div className="card-footer">
            <Button href={this.props.previewUrl} title="Listen now!" />
          </div>
        </div>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.sortZa = this.sortZa.bind(this);
    this.sortAz = this.sortAz.bind(this);
    this.getAjax = this.getAjax.bind(this);
    this.submit = this.submit.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      order: "az",
      songs: []
    };
  }

  handleChange(event) {
    const name = event.target.name;
    this.getAjax(name);
  }

  getAjax(name) {
    $.ajax({
      url:
        "https://itunes.apple.com/search?term=" + name + "&limit=8&entity=song",
      type: "GET",
      dataType: "json"
    })
      .done(
        function(data) {
          this.setState({ songs: data.results });
        }.bind(this)
      )
      .fail(function() {
        console.log("error");
      });
  }

  submit(e) {
    e.preventDefault();
    // Submit form via jQuery/AJAX
    const name = e.target.search.value;
    this.getAjax(name);
  }

  sortAz() {
    this.setState({
      order: "az"
    });
  }

  sortZa() {
    this.setState({
      order: "za"
    });
  }

  render() {
    return (
      <div>
      <div className='row'>
        <form className='form-inline' onSubmit={this.submit}>
          <div className='form-group'>
          <input
            onChange={this.handleChange}
            type="search"
            id="search"
            name="search"
            className='form-control'
          />
          <input className='form-control' type="submit" value="Search" />
        </div>
        </form>
        </div>
        <SortingButton sortAz={this.sortAz} sortZa={this.sortZa} />
        <ThumbnailList order={this.state.order} results={this.state.songs} />
      </div>
    );
  }
}

export default App;
