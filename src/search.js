import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchresults: "",
            resultsvisable: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange(e) {
        if (e.target.value !== "") {
            axios
                .get("/searchuser", {
                    params: {
                        search: e.target.value
                    }
                })
                .then(resp => {
                    this.setState({
                        searchresults: resp.data.searchResults
                    });
                });
        } else {
            this.setState({
                searchresults: ""
            });
        }
    }

    handleClick() {
        this.setState({
            searchresults: ""
        });
    }

    render() {
        const searchresults = this.state.searchresults;
        const searchrender = (
            <div className="searchbox">
                {searchresults &&
                    searchresults.map(user => (
                        <div key={user.id} className="user">
                            <h1>
                                <Link
                                    onClick={this.handleClick}
                                    to={`/user/${user.id}`}
                                >
                                    {user.name} {user.lastname}
                                </Link>
                            </h1>
                        </div>
                    ))}
            </div>
        );
        return (
            <div id="search">
                <form>
                    <input
                        id="searchbar"
                        onChange={this.handleChange}
                        name="search"
                        type="text"
                        placeholder="search for users"
                    />
                </form>
                {searchrender}
            </div>
        );
    }
}
