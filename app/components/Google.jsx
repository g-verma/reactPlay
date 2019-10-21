import React from 'react';
require('./Google.css');

class Google extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
        query: '', 
        hits: [], 
        currentPage:1, 
        postsPerPage:10
      };
    }
    
    handleClick = event =>{
      this.setState({
        currentPage: Number(event.target.id)
      });
    }

 
    onChange = event => {
      this.setState({ query: event.target.value });
    };
  
    onSearch = event => {
      event.preventDefault();
      const { query } = this.state;
      
      if (query === '') {
        return;
      }
      
      const cachedHits = localStorage.getItem(query);
        
      if (cachedHits) {
        this.setState({ hits: JSON.parse(cachedHits) });
      } else {
        fetch('https://hn.algolia.com/api/v1/search?query=' + query)
          .then(response => response.json())
          .then(result => this.onSetResult(result, query));
      }
    }; //onSearch ends here
  
    onSetResult = (result, key) => {
      localStorage.setItem(key, JSON.stringify(result.hits));
      this.setState({ hits: result.hits });
    };
  
    render() {
      const { hits, currentPage, postsPerPage } = this.state;

      console.log(hits);
      const indexOfLastPost = currentPage * postsPerPage;
      const indexOfFirstPost = indexOfLastPost - postsPerPage;
      const currentPosts = hits.slice(indexOfFirstPost, indexOfLastPost);

      const renderPosts = currentPosts.map((post, index) => {
        return <li key={index}>{post}</li>;
      });

      // Logic for displaying page numbers
      const pageNumbers = [];
      for (let i = 1; i <= Math.ceil(hits.length / postsPerPage); i++) {
        pageNumbers.push(i);
      }

      const renderPageNumbers = pageNumbers.map(number => {
        return (
          <li
            key={number}
            id={number}
            onClick={this.handleClick}
          >
            {number}
          </li>
        );
      });

      return (
        <div>
          <h1>Google</h1>
          
          {/* Search Input */}
          <form onSubmit={this.onSearch}>
            <input type="text" onChange={this.onChange} />
            <button type="submit">Search</button>
          </form>
          
          {/* Result */}
          
          {currentPosts.map(item => (
            <div key={item.objectID}><a href={item.url} target='_blank'> {item.title} </a>
            <span> {item.author} </span>
            <span> {item.points}</span>
            <span> {item._tags}</span>
            </div>
            
          ))}

            <ul id="page-numbers">
                {renderPageNumbers}
            </ul>

        </div>
      );
    }
  }
  
  
export default Google;