import React from 'react';

class Home extends React.Component {

    constructor(){
        super();
        this.state = {
        };
    }

    componentDidMount = () => {
    }

    render() {
        return (
            <div>Hi thore !</div>
        );
    }

}

Home.contextTypes = {
    history: React.PropTypes.object
}

export default Home;

