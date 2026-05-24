import { useState } from "react";
import { createModerator } from "../services/moderatorService";
import { checkEmail, checkPass, checkPhone } from "../utils/validators";
import "./CreateModeratorPage.css";

const initialForm = {
  email: "",
  password: "",
  name: "",
  surname: "",
  patronymic: "",
  phone_number: "",
};

const CreateModeratorPage = () => {
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.email || !form.password || !form.name || !form.surname) {
      return "Заповніть обов'язкові поля: email, пароль, ім'я, прізвище";
    }

    if (!checkEmail(form.email)) {
      return "Невірний формат email адреси";
    }

    if (!checkPass(form.password)) {
      return "Пароль має містити щонайменше 8 символів, цифру, велику літеру та спецсимвол";
    }

    if (!checkPhone(form.phone_number)) {
      return "Невірний формат номера телефону";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", message: "" });

    const validationError = validate();
    if (validationError) {
      setFeedback({ type: "danger", message: validationError });
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        email: form.email.trim(),
        password: form.password,
        name: form.name.trim(),
        surname: form.surname.trim(),
        patronymic: form.patronymic.trim() || undefined,
        phone_number: form.phone_number.trim() || undefined,
      };

      const data = await createModerator(payload);
      setFeedback({ type: "success", message: data.message });
      setForm(initialForm);
    } catch (err) {
      setFeedback({
        type: "danger",
        message: err.response?.data?.error || "Не вдалося створити модератора",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-moderator-page">
      <h1>Створення модератора</h1>
      <p className="page-subtitle">
        Додайте нового модератора до системи. Доступ лише для адміністратора.
      </p>

      {feedback.message && (
        <div className={`alert alert-${feedback.type} mb-4`} role="alert">
          {feedback.message}
        </div>
      )}

      <div className="moderator-form-card">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12">
              <label htmlFor="email" className="form-label">
                Email <span className="text-danger">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                disabled={isLoading}
                autoComplete="off"
              />
            </div>

            <div className="col-12">
              <label htmlFor="password" className="form-label">
                Пароль <span className="text-danger">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control"
                value={form.password}
                onChange={handleChange}
                disabled={isLoading}
                autoComplete="new-password"
              />
              <div className="form-text">
                Мінімум 8 символів, цифра, велика літера та спецсимвол
              </div>
            </div>

            <div className="col-md-6">
              <label htmlFor="name" className="form-label">
                Ім'я <span className="text-danger">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="surname" className="form-label">
                Прізвище <span className="text-danger">*</span>
              </label>
              <input
                id="surname"
                name="surname"
                type="text"
                className="form-control"
                value={form.surname}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="patronymic" className="form-label">
                По батькові
              </label>
              <input
                id="patronymic"
                name="patronymic"
                type="text"
                className="form-control"
                value={form.patronymic}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="phone_number" className="form-label">
                Телефон
              </label>
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                className="form-control"
                placeholder="+380501112233"
                value={form.phone_number}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="btn btn-primary btn-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Створення...
                </>
              ) : (
                "Створити модератора"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModeratorPage;
