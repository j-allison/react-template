import React from 'react';

class Something extends React.Component{

    constructor(props, context) {
        super(props);

        this.state = {
        };
    }

    componentWillMount = () => {
    }

    componentDidMount = () => {
    }

    componentWillUnmount = () => {
    }

    componentWillReceiveProps = (nextProps) => {
    }

    render() {

        return (
            <div className="something">
                This IS something!
            </div>
        );
    }

}

Something.contextTypes = {
    history: React.PropTypes.object,
    location: React.PropTypes.object
}

export default Something;
