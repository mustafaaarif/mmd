import React, { useContext } from 'react';
import { InputGroup, InputGroupText, Row, Col, Button } from 'reactstrap';
import ForgotPassword_step1 from "../../views/ForgotPassword/ForgotPassword_step1";
import RememberMe from "./RememberMe";

import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authenticationService } from '../../jwt/_services';
import GoogleOauth from './googleOauth';
import context from "../../utils/context";

const sidebarBackground = {
	backgroundRepeat: "no-repeat",
	backgroundPosition: "bottom center"
};

function Login() {

	const { setToken } = useContext(context);

	function handleClick() {
		var elem = document.getElementById('loginform');
		elem.style.transition = "all 2s ease-in-out";
		elem.style.display = "none";
		document.getElementById('recoverform').style.display = "block";
	}

	function handleToLogin() {
		var elem = document.getElementById('recoverform');
		elem.style.transition = "all 2s ease-in-out";
		elem.style.display = "none";
		document.getElementById('loginform').style.display = "block";
	}

	return (<div className="">
		{/*--------------------------------------------------------------------------------*/}
		{/*Login Cards*/}
		{/*--------------------------------------------------------------------------------*/}
		<div className="auth-wrapper vh-100 d-flex align-items-center" style={sidebarBackground}>

			<div className="container">
				<div id="loginform">
					<Row className="no-gutters justify-content-center">
						<Col md="6" lg="4" className="text-white" style={{ backgroundColor: "#000a60" }}>
							<div className="p-4">
								<h2 className="display-5">Hi,<br />
									<span className="text-cyan font-bold">let's send some loud music out there</span></h2>

							</div>
						</Col>
						<Col md="6" lg="4" className="bg-white">
							<div className="p-4">
								<h3 className="font-medium mb-3">Log In to your account</h3>
								<Formik
									initialValues={{
										username: '',
										password: ''
									}}
									validationSchema={Yup.object().shape({
										username: Yup.string().required('Email is required'),
										password: Yup.string().required('Password is required')
									})}
									onSubmit={({ username, password }, { setStatus, setSubmitting }) => {
										setStatus();
										authenticationService.login(username, password)
											.then(
												user => {
													setStatus({ success: true });
													setSubmitting(true);
													setToken(user.access)
												},
												error => {
													setSubmitting(false);
													setStatus("You have inserted wrong e-mail or password");
												}
											);
									}}
									render={({ errors, status, touched, isSubmitting }) => (
										<Form className="mt-3" id="loginform">
											<InputGroup className="mb-3">
												{/* <InputGroupAddon addonType="prepend"> */}
												<InputGroupText>
													<i className="bi bi-envelope"></i>
												</InputGroupText>
												{/* </InputGroupAddon> */}

												<Field name="username" type="text" className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} />
												<ErrorMessage name="username" component="div" className="invalid-feedback" />
											</InputGroup>
											<InputGroup className="mb-3">
												{/* <InputGroupAddon addonType="prepend"> */}
												<InputGroupText>
													<i className="bi bi-lock"></i>
												</InputGroupText>
												{/* </InputGroupAddon> */}
												<Field name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
												<ErrorMessage name="password" component="div" className="invalid-feedback" />

											</InputGroup>
											<div className="d-flex no-block align-items-center mb-3">
												<RememberMe />

											</div>
											<Row className="mb-3">
												<Col xs="12">
													<Button color="primary" type="submit" block disabled={isSubmitting}>Login</Button>
												</Col>
											</Row>
											{status &&
												<div className={'alert alert-danger'}>{status}</div>
											}
											<div className="justify-content-center d-flex align-items-center">
												Forgot password? <a href="#recoverform" id="to-recover" style={{ paddingLeft: 6 }} onClick={handleClick} className="forgot text-cyan float-right">Reset</a>
											</div>
											<hr />
											<h4 className="text-center text-bold">Or</h4>
											<div className="text-center">
												<GoogleOauth />
											</div>
										</Form>
									)}
								/>
							</div>

						</Col>
					</Row>
				</div>
				<div id="recoverform">
					<ForgotPassword_step1 handleToLogin={handleToLogin} />
				</div>
			</div>
		</div>
	</div>
	);
}

export default Login;