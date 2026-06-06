import { useEffect } from "react";
import { useWeather, WeatherProvider } from "../context/weather";
import { useTranslation } from 'react-i18next';

const WeatherCard = () => {
  const { data } = useWeather();
  const { t } = useTranslation();

  if (!data) return null;

  const lastUpdated = data.current?.last_updated;
  const [date, time] = lastUpdated ? lastUpdated.split(" ") : ["", ""];
  const current = data.current;
  const location = data.location;

  const getUVLevel = (uv) => {
    if (uv <= 2) return { level: t('low'), color: 'success' };
    if (uv <= 5) return { level: t('moderate'), color: 'warning' };
    if (uv <= 7) return { level: t('high'), color: 'orange' };
    if (uv <= 10) return { level: t('veryHigh'), color: 'danger' };
    return { level: t('extreme'), color: 'danger' };
  };

  const uvInfo = getUVLevel(current?.uv || 0);

  return (
    <div className="w-100">
      {/* Main Header Card */}
      <div className="card shadow-lg border-0 rounded-4 mb-4">
        <div className="card-body p-4">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <span className="badge text-white px-3 py-2 rounded-pill mb-3" 
                    style={{ background: 'linear-gradient(135deg, #16a34a 0%, #14b8a6 100%)' }}>
                <i className="bi bi-cloud-sun-fill me-2"></i>
                {t('agroHelpWeather')}
              </span>
              <h2 className="display-5 fw-bold text-dark mb-2">{location?.name}</h2>
              <p className="fs-5 text-secondary mb-1">{location?.region}, {location?.country}</p>
              <p className="text-muted small">
                <i className="bi bi-clock me-2"></i>
                {date} | {time}
              </p>
            </div>
            <div className="col-lg-6 text-lg-end">
              <div className="d-flex align-items-center justify-content-lg-end gap-3 mb-2">
                <img src={current?.condition?.icon} alt={current?.condition?.text} style={{ width: '80px', height: '80px' }} />
                <div className="display-2 fw-bold" style={{ 
                  background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {current?.temp_c}°C
                </div>
              </div>
              <p className="fs-5 fw-medium text-secondary mb-1">{current?.condition?.text}</p>
              <p className="text-muted">
                <i className="bi bi-thermometer-half me-2"></i>
                {t('feelsLike')} {current?.feelslike_c}°C
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Weather Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100 rounded-4" 
               style={{ background: 'linear-gradient(135deg, #fb923c 0%, #ef4444 100%)' }}>
            <div className="card-body p-4 text-white">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-3 p-2" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}>
                  <i className="bi bi-thermometer-half" style={{ fontSize: '1.5rem' }}></i>
                </div>
              </div>
              <h6 className="mb-2" style={{ opacity: 0.9 }}>{t('temperature')}</h6>
              <p className="fs-2 fw-bold mb-1">{current?.temp_c}°C</p>
              <small style={{ opacity: 0.8 }}>{current?.temp_f}°F</small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100 rounded-4" 
               style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)' }}>
            <div className="card-body p-4 text-white">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-3 p-2" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}>
                  <i className="bi bi-droplet-fill" style={{ fontSize: '1.5rem' }}></i>
                </div>
              </div>
              <h6 className="mb-2" style={{ opacity: 0.9 }}>{t('humidity')}</h6>
              <p className="fs-2 fw-bold mb-1">{current?.humidity}%</p>
              <small style={{ opacity: 0.8 }}>{t('dewPoint')}: {current?.dewpoint_c}°C</small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100 rounded-4" 
               style={{ background: 'linear-gradient(135deg, #22d3ee 0%, #14b8a6 100%)' }}>
            <div className="card-body p-4 text-white">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-3 p-2" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}>
                  <i className="bi bi-wind" style={{ fontSize: '1.5rem' }}></i>
                </div>
              </div>
              <h6 className="mb-2" style={{ opacity: 0.9 }}>{t('windSpeed')}</h6>
              <p className="fs-2 fw-bold mb-1">{current?.wind_kph} km/h</p>
              <small style={{ opacity: 0.8 }}>{current?.wind_dir} ({current?.wind_degree}°)</small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100 rounded-4" 
               style={{ background: 'linear-gradient(135deg, #818cf8 0%, #a855f7 100%)' }}>
            <div className="card-body p-4 text-white">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-3 p-2" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}>
                  <i className="bi bi-cloud-drizzle-fill" style={{ fontSize: '1.5rem' }}></i>
                </div>
              </div>
              <h6 className="mb-2" style={{ opacity: 0.9 }}>{t('precipitation')}</h6>
              <p className="fs-2 fw-bold mb-1">{current?.precip_mm} mm</p>
              <small style={{ opacity: 0.8 }}>{current?.precip_in} inches</small>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="row g-3 mb-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100 rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">
                <i className="bi bi-speedometer2 text-primary me-2"></i>
                {t('atmospheric')}
              </h5>
              <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3 mb-3">
                <span className="text-secondary fw-medium">{t('pressure')}</span>
                <span className="text-dark fw-bold">{current?.pressure_mb} mb</span>
              </div>
              <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3 mb-3">
                <span className="text-secondary fw-medium">{t('cloudCover')}</span>
                <span className="text-dark fw-bold">{current?.cloud}%</span>
              </div>
              <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3">
                <span className="text-secondary fw-medium">{t('visibility')}</span>
                <span className="text-dark fw-bold">{current?.vis_km} km</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100 rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">
                <i className="bi bi-thermometer text-warning me-2"></i>
                {t('temperature')}
              </h5>
              <div className="d-flex justify-content-between align-items-center p-3 rounded-3 mb-3" 
                   style={{ backgroundColor: '#fff7ed' }}>
                <span className="text-secondary fw-medium">{t('feelsLike')}</span>
                <span className="text-dark fw-bold">{current?.feelslike_c}°C</span>
              </div>
              <div className="d-flex justify-content-between align-items-center p-3 rounded-3 mb-3" 
                   style={{ backgroundColor: '#dbeafe' }}>
                <span className="text-secondary fw-medium">{t('windChill')}</span>
                <span className="text-dark fw-bold">{current?.windchill_c}°C</span>
              </div>
              <div className="d-flex justify-content-between align-items-center p-3 rounded-3" 
                   style={{ backgroundColor: '#fee2e2' }}>
                <span className="text-secondary fw-medium">{t('heatIndex')}</span>
                <span className="text-dark fw-bold">{current?.heatindex_c}°C</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100 rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">
                <i className="bi bi-sun-fill text-warning me-2"></i>
                {t('windAndUv')}
              </h5>
              <div className="d-flex justify-content-between align-items-center p-3 rounded-3 mb-3" 
                   style={{ backgroundColor: '#cffafe' }}>
                <span className="text-secondary fw-medium">{t('windGust')}</span>
                <span className="text-dark fw-bold">{current?.gust_kph} km/h</span>
              </div>
              <div className="p-3 rounded-3 mb-3" style={{ backgroundColor: '#fef3c7' }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-secondary fw-medium">{t('uvIndex')}</span>
                  <span className="text-dark fw-bold">{current?.uv}</span>
                </div>
                <span className={`badge bg-${uvInfo.color} px-3 py-2`}>
                  {uvInfo.level}
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3">
                <span className="text-secondary fw-medium">{t('dayNight')}</span>
                <span className="text-dark fw-bold">{current?.is_day ? t('day') : t('night')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Farming Recommendations */}
      <div className="card border-0 shadow-lg rounded-4 text-white" 
           style={{ background: 'linear-gradient(135deg, #16a34a 0%, #14b8a6 100%)' }}>
        <div className="card-body p-4">
          <h5 className="fw-bold mb-4">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {t('farmingRecommendations')}
          </h5>
          <div className="row g-3">
            <div className="col-md-4">
              <div className="rounded-3 p-3" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <h6 className="fw-semibold mb-2">{t('irrigation')}</h6>
                <p className="mb-0 small">
                  {current?.humidity > 70 ? t('lowIrrigationNeeded') : current?.humidity > 40 ? t('moderateIrrigationRecommended') : t('highIrrigationAdvised')}
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="rounded-3 p-3" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <h6 className="fw-semibold mb-2">{t('fieldWork')}</h6>
                <p className="mb-0 small">
                  {current?.precip_mm > 5 ? t('avoidFieldWork') : current?.wind_kph > 20 ? t('cautionAdvised') : t('goodConditions')}
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="rounded-3 p-3" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <h6 className="fw-semibold mb-2">{t('sunExposure')}</h6>
                <p className="mb-0 small">
                  UV: {uvInfo.level} - {current?.uv > 5 ? t('useProtection') : t('safeForWork')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WeatherContent = () => {
  const { searchCity, setSearchCity, fetchData, fetchCurrentUserLocationData, loading, error } = useWeather();
  const { t } = useTranslation();

  useEffect(() => {
    fetchCurrentUserLocationData();
  }, []);

  const handleSearch = () => {
    fetchData();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchData();
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #e0f2fe 0%, #cffafe 50%, #ccfbf1 100%)',
      padding: '2rem 0'
    }}>
      <div className="container">
        <div className="row justify-content-center mb-4">
          <div className="col-12 col-lg-8">
            <div className="text-center mb-4">
              <h1 className="display-4 fw-bold mb-3" style={{ color: '#1e40af' }}>
                <i className="bi bi-cloud-sun me-3"></i>
                {t('weatherForecasting')}
              </h1>
              <p className="text-secondary fs-5">{t('getRealTimeWeatherUpdates')}</p>
            </div>

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
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                  <button
                    className="btn btn-primary px-4 rounded-end-3"
                    onClick={handleSearch}
                    disabled={loading || !searchCity.trim()}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        {t('searching')}
                      </>
                    ) : (
                      <>
                        <i className="bi bi-search me-2"></i>
                        {t('search')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger shadow-sm rounded-4" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 col-xl-11">
            <WeatherCard />
          </div>
        </div>
      </div>
    </div>
  );
};

const WeatherForecasting = () => {
  return (
    <WeatherProvider>
      <WeatherContent />
    </WeatherProvider>
  );
};

export default WeatherForecasting;