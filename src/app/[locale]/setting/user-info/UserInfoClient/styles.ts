import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token }) => ({
  userInfo: {
    'height': '100%',
    'width': '100%',
    'backgroundColor': token.colorBgLayout,
    'position': 'relative',
    '& > div': {
      position: 'relative',
      overflow: 'hidden',
      height: '100%',
      paddingBottom: '40px',
      paddingTop: '64px',
    },
  },
  sub: {
    width: '100%',
  },
  avatarImg: {
    borderRadius: '50%',
  },
  content: {
    'paddingTop': 16,
    'paddingBottom': 42,
    '.ant-form': {
      width: 600,
    },
    '.ant-upload-wrapper': {
      textAlign: 'center',
      position: 'relative',
    },
    '.ant-upload-wrapper.ant-upload-picture-circle-wrapper .ant-upload.ant-upload-select': {
      overflow: 'hidden',
      border: 'unset',
    },
    '.ant-input-lg': {
      borderRadius: token.borderRadius,
      padding: '8px 11px',
    },
  },
  uploadText: {
    'border': 0,
    'background': 'none',
    '& > div': {
      marginTop: 4,
    },
  },
}));
