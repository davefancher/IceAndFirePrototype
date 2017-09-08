import React, { Component } from "react";
import Loading from "../../shared/loading.jsx";

const List = (props) => {
    if (props.length === 0) return null;

    const labelStyle = {
        marginRight: "3px",
        marginBottom: "3px",
        fontSize: "14px",
        display: "inline-block",
        fontWeight: "normal"
    };

    return (
        <div>
            {props.map((p, ix) => <span key={ix} style={labelStyle} className="label label-default">{p}</span>)}
        </div>
    )
}
const PropertyGroup = (props) => {
    if (!props.value) return null;

    var content = null;

    if(Array.isArray(props.value)) {
        content = List(props.value);
    } else if (props.value.location && props.value.date) {
        content = <div>{props.value.date}<br />{props.value.location}</div>;
    } else if (props.value.location) {
        content = props.value.location;
    } else if (props.value.date) {
        content = props.value.date;
    } else {
        content = props.value;
    }

    return (
        <div>
            <dt>{props.title}:</dt>
            <dd>{content || <i className="text-muted">Unknown</i>}</dd>
        </div>
    );
};

export class CharacterDetails extends Component {
    componentDidMount () {
        this.props.getCharacter();
    }

    render () {
        if (this.props.loading) {
           return <Loading />;
        }

        return (
            <div>
                <h2>{this.props.character.name}</h2>
                <dl className="dl-horizontal">
                    <PropertyGroup title="Gender" value={this.props.character.gender} />
                    <PropertyGroup title="Culture" value={this.props.character.culture} />
                    <PropertyGroup title="Born" value={this.props.character.born} />
                    <PropertyGroup title="Died" value={this.props.character.died} />
                    <PropertyGroup title="Aliases" value={this.props.character.aliases} />
                    <PropertyGroup title="Titles" value={this.props.character.titles} />
                    <PropertyGroup title="Portrayed By" value={this.props.character.portrayedBy} />
                </dl>
            </div>
        );
    }
}
