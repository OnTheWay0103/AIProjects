import mongoose, { Model } from 'mongoose';

interface IUser {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

type UserModel = Model<IUser>;

const userSchema = new mongoose.Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: [true, '用户名是必需的'],
      trim: true,
      minlength: [2, '用户名至少需要2个字符'],
      maxlength: [50, '用户名不能超过50个字符'],
    },
    email: {
      type: String,
      required: [true, '邮箱是必需的'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, '请输入有效的邮箱地址'],
    },
    password: {
      type: String,
      required: [true, '密码是必需的'],
      minlength: [6, '密码至少需要6个字符'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

// 完全禁用所有中间件
userSchema.pre('save', function(next) {
  console.log('Pre-save hook called:', {
    isNew: this.isNew,
    isModified: this.isModified(),
    password: this.password
  });
  // 直接调用next，不进行任何修改
  next();
});

// 禁用所有其他中间件
userSchema.pre('findOneAndUpdate', function(next: () => void) {
  next();
});

userSchema.pre('updateOne', function(next: () => void) {
  next();
});

userSchema.pre('findOneAndDelete', function(next: () => void) {
  next();
});

userSchema.pre('deleteOne', function(next: () => void) {
  next();
});

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

export const User = (mongoose.models.User || mongoose.model<IUser>('User', userSchema)) as UserModel; 