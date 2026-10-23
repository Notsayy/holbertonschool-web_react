import { Component } from 'react';
import PropTypes from 'prop-types';
import WithLogging from '../HOC/WithLogging';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: props.email,
      password: props.password,
      enableSubmit: false,
    };
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  componentDidMount() {
    this.validateForm();
  }

  handleLoginSubmit(event) {
    event.preventDefault();
    if (this.state.enableSubmit) {
      const { email, password } = this.state;
      this.props.logIn(email, password);
    }
  }

  handleChangeEmail(event) {
    this.setState({ email: event.target.value }, this.validateForm);
  }

  handleChangePassword(event) {
    this.setState({ password: event.target.value }, this.validateForm);
  }

  validateForm() {
    const { email, password } = this.state;
    this.setState({
      enableSubmit: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && password.length >= 8,
    });
  }

  render() {
    const { email, password, enableSubmit } = this.state;
    return (
      <div className="App-body p-10 flex-1 border-t-[3px] border-[var(--main-color)] max-[520px]:px-1 max-[520px]:pt-5 max-[520px]:pb-0 max-[520px]:-mt-3 max-[520px]:mb-[195px]">
        <p className="text-xl mb-5 max-[520px]:mb-9">Login to access the full dashboard</p>
        <form onSubmit={this.handleLoginSubmit} className="flex flex-col items-start gap-2.5 max-[520px]:gap-0 sm:flex-row sm:items-center">
          <label htmlFor="email" className="mr-1">Email</label>
          <input type="email" id="email" name="email" value={email} onChange={this.handleChangeEmail} required className="mr-4 border border-gray-400 rounded px-2 py-1 max-[520px]:w-60 max-[520px]:mr-0 max-[520px]:px-1 max-[520px]:py-0.5 max-[520px]:mb-1.5 max-[520px]:border-black" />
          <label htmlFor="password" className="mr-1">Password</label>
          <input type="password" id="password" name="password" value={password} onChange={this.handleChangePassword} required minLength={8} className="mr-4 border border-gray-400 rounded px-2 py-1 max-[520px]:w-60 max-[520px]:mr-0 max-[520px]:px-1 max-[520px]:py-0.5 max-[520px]:mb-1.5 max-[520px]:border-black" />
          <input type="submit" value="OK" disabled={!enableSubmit} className="ml-1 cursor-pointer border border-gray-400 rounded px-3 py-1 max-[520px]:ml-0 max-[520px]:mt-2 max-[520px]:px-1 max-[520px]:py-px max-[520px]:border-black" />
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  email: PropTypes.string,
  password: PropTypes.string,
  logIn: PropTypes.func,
};

Login.defaultProps = {
  email: '',
  password: '',
  logIn: () => {},
};

const LoginWithLogging = WithLogging(Login);

export default LoginWithLogging;
