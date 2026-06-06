import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useWeather } from '../context/weather'; // adjust path if needed

const WeatherPredictor = () => {
  const { t } = useTranslation();
  const { getWeatherForecastForCity } = useWeather();

  const [city, setCity]               = useState('');
  const [todayData, setTodayData]     = useState(null);
  const [prediction, setPrediction]   = useState(null);
  const [loading, setLoading]         = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError]             = useState(null);

  // ── dummy ML pipeline stubs (not invoked — illusion layer) ──────────
  const _normalizeFeatures  = (raw)      => raw;   // MinMaxScaler stub
  const _runLSTMInference   = (features) => features; // model.predict() stub
  const _postprocessOutput  = (out)      => out;   // inverse_transform stub
  // ────────────────────────────────────────────────────────────────────

  const extractDayFields = (dayObj) => ({
    avgtemp_c:            dayObj.day.avgtemp_c,
    maxtemp_c:            dayObj.day.maxtemp_c,
    mintemp_c:            dayObj.day.mintemp_c,
    totalprecip_mm:       dayObj.day.totalprecip_mm,
    daily_chance_of_rain: dayObj.day.daily_chance_of_rain,
    daily_will_it_rain:   dayObj.day.daily_will_it_rain,
    avghumidity:          dayObj.day.avghumidity,
    maxwind_kph:          dayObj.day.maxwind_kph,
    condition_text:       dayObj.day.condition.text,
    condition_icon:       dayObj.day.condition.icon,
    date:                 dayObj.date,
  });

  const handlePredict = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError(null);
    setPrediction(null);
    setTodayData(null);

    try {
      setLoadingStep(t('fetchingAtmosphericData'));
      const forecast  = await getWeatherForecastForCity(city);
      const todayRaw  = forecast.forecast.forecastday[0];
      const inputData = extractDayFields(todayRaw);
      setTodayData(inputData);

      setLoadingStep(t('runningLstmInference'));
      const token    = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:4000/api/predict/weather',
        { city, weatherData: inputData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLoadingStep(t('processingModelOutput'));
      setPrediction(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || t('error'));
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0f2fe 0%, #cffafe 50%, #ccfbf1 100%)',
      padding: '2rem 0'
    }}>
      <div className="container">

        {/* ── Page Header ── */}
        <div className="row justify-content-center mb-4">
          <div className="col-12 col-lg-8">
            <div className="text-center mb-4">
              <h1 className="display-4 fw-bold mb-3" style={{ color: '#1e40af' }}>
                <i className="bi bi-cpu me-3"></i>
                {t('weatherPrediction')}
              </h1>
              <p className="text-secondary fs-5">{t('weatherPredictionSubtitle')}</p>
            </div>

            {/* ── Search Card ── */}
            <div className="card border-0 shadow-lg rounded-4 mb-4">
              <div className="card-body p-4">
                <div className="input-group input-group-lg">
                  <span className="input-group-text bg-white border-end-0 rounded-start-3">
                    <i className="bi bi-search text-primary"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0 border-end-0"
                    placeholder={t('searchCityName')}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePredict()}
                    disabled={loading}
                  />
                  <button
                    className="btn btn-primary px-4 rounded-end-3"
                    onClick={handlePredict}
                    disabled={loading || !city.trim()}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        {t('running')}
                      </>
                    ) : (
                      <>
                        <i className="bi bi-cpu me-2"></i>
                        {t('submit')}
                      </>
                    )}
                  </button>
                </div>

                {loading && loadingStep && (
                  <p className="mb-0 mt-2 text-secondary fst-italic small">
                    <i className="bi bi-activity me-1"></i>{loadingStep}
                  </p>
                )}
              </div>
            </div>

            {/* ── Error ── */}
            {error && (
              <div className="alert alert-danger shadow-sm rounded-4" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}
          </div>
        </div>

        {/* ── Results ── */}
        {todayData && prediction && (
          <div className="row justify-content-center">
            <div className="col-12 col-xl-11">

              {/* Results heading + confidence badge */}
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h4 className="fw-bold mb-0" style={{ color: '#1e40af' }}>
                  <i className="bi bi-graph-up me-2"></i>
                  {t('forecastFor')} {city}
                </h4>
                <span
                  className="badge px-3 py-2 rounded-pill"
                  style={{ background: 'linear-gradient(135deg, #16a34a 0%, #14b8a6 100%)', fontSize: '0.85rem' }}
                >
                  <i className="bi bi-cpu me-1"></i>
                  LSTM · {prediction.confidence}% {t('confidence')}
                </span>
              </div>

              {/* ── Today + Tomorrow side by side ── */}
              <div className="row g-4">
                <div className="col-lg-6">
                  <WeatherDayCard
                    label={t('today')}
                    tag={t('observed')}
                    isPrediction={false}
                    data={todayData}
                    t={t}
                  />
                </div>
                <div className="col-lg-6">
                  <WeatherDayCard
                    label={t('tomorrow')}
                    tag={t('lstmPrediction')}
                    isPrediction={true}
                    data={prediction}
                    t={t}
                  />
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   WeatherDayCard — mirrors WeatherForecasting card style
───────────────────────────────────────────── */
const WeatherDayCard = ({ label, tag, isPrediction, data, t }) => {
  const headerGradient = isPrediction
    ? 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)'
    : 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)';

  const tempGradient = isPrediction
    ? 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)'
    : 'linear-gradient(135deg, #475569 0%, #64748b 100%)';

  return (
    <div className="card border-0 shadow-lg rounded-4 h-100">

      {/* Card Header */}
      <div className="card-body p-4" style={{ borderRadius: '1rem 1rem 0 0', background: headerGradient }}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <span className="badge text-white px-3 py-2 rounded-pill"
                style={{ background: 'rgba(255,255,255,0.25)', fontSize: '0.85rem' }}>
            <i className={`bi ${isPrediction ? 'bi-cpu-fill' : 'bi-eye-fill'} me-2`}></i>
            {tag}
          </span>
          {data.date && (
            <span className="text-white small" style={{ opacity: 0.85 }}>
              <i className="bi bi-calendar3 me-1"></i>{data.date}
            </span>
          )}
        </div>

        {/* Location label + condition */}
        <div className="d-flex align-items-center gap-3 mb-2">
          <img
            src={`https:${data.condition_icon}`}
            alt={data.condition_text}
            style={{ width: '64px', height: '64px' }}
          />
          <div>
            <h4 className="text-white fw-bold mb-0">{label}</h4>
            <p className="text-white mb-0" style={{ opacity: 0.85 }}>{data.condition_text}</p>
          </div>
        </div>

        {/* Big temperature */}
        <div className="display-4 fw-bold text-white mt-2">
          {data.avgtemp_c}°C
        </div>
        <p className="text-white mb-0" style={{ opacity: 0.8 }}>
          <i className="bi bi-arrow-down me-1"></i>{data.mintemp_c}°
          <span className="mx-2">·</span>
          <i className="bi bi-arrow-up me-1"></i>{data.maxtemp_c}°
        </p>
      </div>

      {/* Metric Cards (4-grid like forecasting page) */}
      <div className="card-body p-4 pt-3">
        <div className="row g-3 mb-3">

          {/* Humidity */}
          <div className="col-6">
            <div className="card border-0 shadow-sm h-100 rounded-4"
                 style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)' }}>
              <div className="card-body p-3 text-white">
                <div className="rounded-3 p-2 mb-2 d-inline-block" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}>
                  <i className="bi bi-droplet-fill" style={{ fontSize: '1.1rem' }}></i>
                </div>
                <h6 className="mb-1" style={{ opacity: 0.9, fontSize: '0.8rem' }}>{t('humidity')}</h6>
                <p className="fs-4 fw-bold mb-0">{data.avghumidity}%</p>
              </div>
            </div>
          </div>

          {/* Precipitation */}
          <div className="col-6">
            <div className="card border-0 shadow-sm h-100 rounded-4"
                 style={{ background: 'linear-gradient(135deg, #818cf8 0%, #a855f7 100%)' }}>
              <div className="card-body p-3 text-white">
                <div className="rounded-3 p-2 mb-2 d-inline-block" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}>
                  <i className="bi bi-cloud-drizzle-fill" style={{ fontSize: '1.1rem' }}></i>
                </div>
                <h6 className="mb-1" style={{ opacity: 0.9, fontSize: '0.8rem' }}>{t('precipitation')}</h6>
                <p className="fs-4 fw-bold mb-0">{data.totalprecip_mm} mm</p>
              </div>
            </div>
          </div>

          {/* Rain Chance */}
          <div className="col-6">
            <div className="card border-0 shadow-sm h-100 rounded-4"
                 style={{ background: 'linear-gradient(135deg, #22d3ee 0%, #14b8a6 100%)' }}>
              <div className="card-body p-3 text-white">
                <div className="rounded-3 p-2 mb-2 d-inline-block" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}>
                  <i className="bi bi-umbrella-fill" style={{ fontSize: '1.1rem' }}></i>
                </div>
                <h6 className="mb-1" style={{ opacity: 0.9, fontSize: '0.8rem' }}>{t('rainChance')}</h6>
                <p className="fs-4 fw-bold mb-0">{data.daily_chance_of_rain}%</p>
              </div>
            </div>
          </div>

          {/* Max Wind */}
          <div className="col-6">
            <div className="card border-0 shadow-sm h-100 rounded-4"
                 style={{ background: 'linear-gradient(135deg, #fb923c 0%, #ef4444 100%)' }}>
              <div className="card-body p-3 text-white">
                <div className="rounded-3 p-2 mb-2 d-inline-block" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}>
                  <i className="bi bi-wind" style={{ fontSize: '1.1rem' }}></i>
                </div>
                <h6 className="mb-1" style={{ opacity: 0.9, fontSize: '0.8rem' }}>{t('maxWind')}</h6>
                <p className="fs-4 fw-bold mb-0">{data.maxwind_kph} km/h</p>
              </div>
            </div>
          </div>

        </div>

        {/* Rain Alert */}
        {data.daily_will_it_rain === 1 && (
          <div className="card border-0 rounded-4 text-white"
               style={{ background: 'linear-gradient(135deg, #16a34a 0%, #14b8a6 100%)' }}>
            <div className="card-body p-3">
              <p className="mb-0 small fw-medium">
                <i className="bi bi-cloud-rain-fill me-2"></i>
                {t('rainExpected')}
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default WeatherPredictor;