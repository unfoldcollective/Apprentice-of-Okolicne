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
        let add;

        switch (step) {
            case 1:
                title = 'Chosse a pattern';
                data = patterns;
                add = this.setPattern;
                break;
            case 2:
                title = 'Choose an exterior';
                data = exteriors;
                add = this.setExterior;
                break;
            case 3:
                title = 'Drag figures to the canvas';
                data = figures;
                break;
        }

        return { title, data, add };
    }

    canContinue(step) {
        if (step === 1 && this.state.objects.pattern) return true;
        if (step === 2 && this.state.objects.exterior) return true;
        if (step === 3 && this.state.objects.figures.length !== 0) return true;
        return false;
    }

    setPattern(pattern) {
        this.setState({
            objects: Object.assign(this.state.objects, {
                pattern: pattern
            })
        });
    }

    setExterior(exterior) {
        this.setState({
            objects: Object.assign(this.state.objects, {
                exterior: exterior
            })
        });
    }

    nextStep(e) {

        if(this.state.step === 2) return;

        this.setState({
            step: this.state.step + 1
        });
    }

    render() {
        const { title, data, add } = this.getPaletteData(this.state.step);

        return (
            <div className={styles.create}>
                <Canvas objects={this.state.objects} add={add.bind(this)} />
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
