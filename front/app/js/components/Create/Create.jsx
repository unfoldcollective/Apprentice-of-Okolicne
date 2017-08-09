import React from 'react';
import styles from './Create.css';

import Canvas from './Canvas/Canvas.jsx';
import Palette from './Palette/Palette.jsx';

import { patterns, exteriors, figures } from '../../../data/parts.json';

export default class Create extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            step: 1,
            objects: {
                pattern: null,
                exterior: null,
                figures: []
            }
        };
    }

    getPaletteData(step) {
        let title;
        let data;

        switch (step) {
            case 1:
                title = 'Chosse a pattern';
                data = patterns;
                break;
            case 2:
                title = 'Choose an exterior';
                data = exteriors;
                break;
            case 3:
                title = 'Drag figures to the canvas';
                data = figures;
                break;
        }

        return { title, data };
    }

    canContinue(step) {
        if (step === 1 && this.state.objects.pattern) return true;
        if (step === 2 && this.state.objects.exterior) return true;
        if (step === 3 && this.state.objects.figures.length !== 0) return true;
        return false;
    }

    nextStep(e) {
        console.log(e);
    }

    render() {
        const { title, data } = this.getPaletteData(this.state.step);

        return (
            <div className={styles.create}>
                <Canvas objects={this.state.objects} />
                <Palette
                    title={title}
                    d={data}
                    continue={this.canContinue(this.state.step)}
                    nextStep={this.nextStep.bind(this)}
                />
            </div>
        );
    }
}
