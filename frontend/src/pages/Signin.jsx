import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from 'react-toastify';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Signin = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: '',
    otp: ''
  });
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible'
      });
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!formData.phone || formData.phone.length < 10) {
      return toast.error(t('pleaseEnterValidPhoneNumber'));
    }

    setLoading(true);
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const formattedPhone = formData.phone.startsWith('+') ? formData.phone : `+91${formData.phone}`;
      
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setStep(2);
      setTimer(60);
      toast.success(t('otpSentSuccessfully'));
    } catch (error) {
      console.error("OTP Error:", error);
      toast.error(error.message || t('failedToSendOtp'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!formData.otp || formData.otp.length !== 6) {
      return toast.error(t('pleaseEnterValidOtp'));
    }

    setLoading(true);
    try {
      const result = await confirmationResult.confirm(formData.otp);
      const user = result.user;
      const idToken = await user.getIdToken();

      toast.success(t('loginSuccessful'));
      localStorage.setItem('token', idToken);
      navigate('/dashboard');
    } catch (error) {
      console.error("Verification Error:", error);
      toast.error(t('invalidOrExpiredOtp'));
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (timer > 0) return;
    handleSendOTP({ preventDefault: () => {} });
  };

  return (
    <Container className="min-vh-100 d-flex align-items-center justify-content-center py-5">
      <Row className="w-100">
        <Col xs={12} md={8} lg={6} xl={4} className="mx-auto">
          <Card>
            <Card.Body className="p-4">
              <h2 className="text-center mb-4" style={{ fontSize: 'var(--font-size-section-heading)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>{t('farmerLogin')}</h2>
              
              <div id="recaptcha-container"></div>

              {step === 1 && (
                <Form onSubmit={handleSendOTP}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: 'var(--color-text-primary)' }}>{t('phoneNumber')}</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">+91</span>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={t('tenDigitMobileNumber')}
                        required
                      />
                    </div>
                  </Form.Group>
                  <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                    {loading ? t('sending') : t('sendOtp')}
                  </Button>
                </Form>
              )}

              {step === 2 && (
                <Form onSubmit={handleVerifyOTP}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: 'var(--color-text-primary)' }}>{t('enterOtp')}</Form.Label>
                    <Form.Control
                      type="text"
                      className="text-center"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      placeholder={t('sixDigitCode')}
                      maxLength="6"
                      required
                    />
                  </Form.Group>
                  <div className="text-center mb-3">
                    {timer > 0 ? (
                      <small style={{ color: 'var(--color-text-secondary)' }}>{t('resendOtpIn')} {timer}s</small>
                    ) : (
                      <Button type="button" onClick={resendOTP} variant="link" className="btn-sm p-0">{t('resendOtp')}</Button>
                    )}
                  </div>
                  <div className="d-flex gap-2">
                    <Button type="button" onClick={() => setStep(1)} variant="outline-secondary" className="w-50">{t('back')}</Button>
                    <Button type="submit" variant="primary" className="w-50" disabled={loading}>
                      {loading ? t('verifying') : t('login')}
                    </Button>
                  </div>
                </Form>
              )}

              <p className="text-center mt-4 mb-0" style={{ color: 'var(--color-text-secondary)' }}>
                {t('notRegistered')} <Link to="/signup" style={{ color: 'var(--color-primary)' }}>{t('createAccount')}</Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Signin;
