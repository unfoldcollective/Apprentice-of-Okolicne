import React from 'react';
import Button from '../Button/Button.jsx';
import styles from './SaveDialog.css';
import T from 'i18n-react';

class SideInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      saving: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.saving) {
      this.setState({
        saving: true
      });
    }
  }

  render() {
    return (
      <section className={styles.side}>
        <header>
          <h2 className={styles.sideTitle}>{T.translate('save.title')}</h2>
        </header>
        <p className={styles.text}>{T.translate('save.help')}</p>
        <footer className={styles.footer}>
          <div className={styles.mainButtons}>
            {this.state.saving ? (
              <img
                className={styles.saving}
                src="/media/elements/I-LoadingSpinner.svg"
              />
            ) : (
              <Button
                disabled={this.props.processing}
                className={styles.button}
                action={this.props.nextStep}
              >
                <img
                  className={styles.buttonImage}
                  src={
                    this.props.saveStep ? (
                      '/media/elements/B-completeF.svg'
                    ) : (
                      '/media/elements/B-nextF.svg'
                    )
                  }
                />
              </Button>
            )}
          </div>

          <div className={styles.back}>
            <Button
              disabled={this.state.saving}
              action={this.props.setExitMode}
              className={styles.blockButton}
            >
              <img
                className={styles.buttonImage}
                src="/media/elements/B-homeF.svg"
              />
            </Button>
          </div>
        </footer>
      </section>
    );
  }
}

export default SideInfo;
