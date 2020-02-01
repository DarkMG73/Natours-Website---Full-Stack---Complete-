const mongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcryptjs');

const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A user must have a name'],
      trim: true,
      maxlength: [40, 'A name must have less than or equal to 40],characters.'],
      minlength: [1, 'A name must have 1 or more characters],characters.']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: {
      type: String
    },
    role: {
      type: String,
      enum: ['user', 'guide', 'lead-guide', 'admin'],
      default: 'user'
    },
    password: {
      type: String,
      required: [true, 'A user must have a password'],
      minlength: [8, 'The password must be at least eight characters long.'],
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, 'You must confirm the password'],
      validate: {
        // This only works on SAVE!
        validator: function(el) {
          return el === this.password;
        },
        message: 'Passwords are not the same.'
      }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false
    }
  }
  // {
  //   // Schema options
  //   toJSON: { virtuals: true },
  //   toObject: { virtuals: true }
  // }
);

userSchema.pre('save', async function(next) {
  //Skip if password was not modified
  if (!this.isModified('password')) return next();

  // Hash encrypt the password with a cost of 12
  // The highr the number the more secure
  this.password = await bcrypt.hash(this.password, 12);

  // Once the passwordConfirm is used to connfirm
  // the password, it should be removed.
  this.passwordConfirm = undefined;
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password' || this.isNew)) return next();

  // Sometimes the database is slower to get back than the JWT is
  // created, which would make the following timestamp after the
  // JWT time and the user can then not log in. Fix this by subtracting 1 second
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function(next) {
  //This is query middleware,.
  //This points to the current query.
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    // False means not changed
    return JWTTimestamp < changedTimestamp;
  }

  // False means not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  // Cryplto is a built-in Node module (called at the head of the page)
  // This creates a rendom token to use as a temp password.admin-nav
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Encypt it
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log('resetToken', { resetToken });
  console.log('this.passwordResetToken', this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
