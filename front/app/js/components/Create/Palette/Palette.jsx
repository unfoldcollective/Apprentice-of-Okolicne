import React from 'react';

import Draggable from '../Draggable/Draggable.jsx';
import Image from '../Image/Image.jsx';
import Button from '../Button/Button.jsx';

export default class Palette extends React.Component {
    constructor(props) {
        super(props);
    }

    getPaletteItems() {
        const items = this.props.d.map((d, i) => {
            return (
                <li key={`palette_${i}`}>
                    <Draggable>
                        <Image src={d.image} text={d.text} />
                    </Draggable>
                </li>
            );
        });

        return (
            <ul>
                {items}
            </ul>
        );
    }

    render() {
        return (
            <section className="">
                <header>
                    <h2>
                        {this.props.title}
                    </h2>
                </header>
                {this.getPaletteItems()}

                <Button
                    disabled={!this.props.continue}
                    action={this.props.nextStep}
                >
                    Continue
                </Button>
            </section>
        );
    }
}
