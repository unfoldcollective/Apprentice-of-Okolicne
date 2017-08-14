const IS_PROD = process.env.NODE_ENV === 'production';

const WDS_PORT = process.env.PORT || 3000;

const SCRIPT_PATH = IS_PROD ? '/' : `http://192.168.1.156:${WDS_PORT}/`;

module.exports = {
    IS_PROD,
    WDS_PORT,
    SCRIPT_PATH
};
