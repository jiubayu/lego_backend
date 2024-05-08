const { Schema } = require('mongoose');
const AutoIncrementFactory = require('mongoose-sequence');
function initUserModel(app) {
  const AutoIncrement = new AutoIncrementFactory(app.mongoose);
  const UserSchema = new Schema(
    {
      username: {type: String, unique: true, required: true},
      password: {type: String},
      nickName: {type: String},
      picture: {type: String},
      emial: {type: String},
      phoneNumber: {type: String},
      type: {type: String, default: 'emial'}, 
    },
    {
      timestamps: true,
      toJSON: {
        transform(_doc, ret) {
          delete ret.password;
          delete ret.__v;
        },
      },
    }
  ); // 将createAt和updateAt自动添加到模型中
  UserSchema.plugin(AutoIncrement, {inc_field: 'id', id:'users_id_counter'});
  return app.mongoose.model('User', UserSchema);
}
module.exports = initUserModel;