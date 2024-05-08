const userErrorMessage = {
  // errorno
  // A-BB-CCC
  // A 1 系统级错误 2 网络错误
  // BB 01 用户模块
  // CCC 对应的错误 自增处理
  uservalidateFail: {
    errorno: 101001,
    message: '用户信息验证失败',
  },
  createUserAlreadyExists: {
    errorno: 101002,
    message: '该邮箱已经被注册，请重新登陆',
  },
  loginCheckFailInfo: {
    errorno: 101003,
    message: '该用户不存在或者密码错误',
  },
  loginvalidateFailInfo: {
    errorno: 101004,
    message: '登陆校验失败',
  },
  // 发送短信验证码过于频繁
  sendVerifyCodeFrequentlyFailInfo: {
    errorno: 101005,
    message: '请勿频繁获取短信验证码',
  },
  // 登陆时，验证码不正确
  loginVerifyCodeIncorrectFailInfo: {
    errorno: 101006,
    message: '验证码不正确',
  },
  // 验证码发送失败
  sendVerifyCodeError: {
    errorno: 101007,
    message: '验证码发送失败',
  },
};

module.exports = {
  userErrorMessage,
};