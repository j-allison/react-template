import React from 'react';

class App extends React.Component{

    constructor(){
        super();
        this.state = {
        };
    }

    componentDidMount = () => {
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ key: nextProps.routes.reverse()[0].component.name });
    }

    render() {
        var key = this.state.key || this.props.routes.reverse()[0].component.name;

        return (
            <application>
                {React.cloneElement(this.props.children, {key: key})}
            </application>
        );
    }

}

App.contextTypes = {
    history: React.PropTypes.object
}

export default App;
