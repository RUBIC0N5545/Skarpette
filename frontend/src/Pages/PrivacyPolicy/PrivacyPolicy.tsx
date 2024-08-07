import PageNavigation from "../../Components/PageNavigation/PageNavigation";
import Questions from "../../Components/Questions/Questions";
import "./PrivacyPolicy.scss";

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <PageNavigation
        linkText="Політика конфіденційності"
        homeLink="/"
        linkHref="/privacy-policy"
      />

      <div className="privacy">
        <div className="privacy__text">
          <h2 className="privacy__title">Політика конфіденційності</h2>

          <section className="privacy__section">
            <h6 className="privacy__section-title">Загальне</h6>
            <p className="privacy__section-info">
              Дана Політика конфіденційності визначає правила збору, обробки та
              використання персональних даних (персональної інформації), що
              передаються Користувачами при використанні Веб-сайту
              https://example.com/ (надалі – Веб-сайт).
            </p>
            <p className="privacy__section-info">
              Персональні дані збираються Адміністрацією Веб-сайту з метою
              забезпечення реалізації відносин у сфері охорони здоров’я.
            </p>
            <p className="privacy__section-info">
              Здійснюючи перегляд Веб-сайту або його використання іншим чином,
              Користувач приймає та погоджується із методами роботи, описаними в
              цій Політиці конфіденційності.
            </p>
          </section>

          <section className="privacy__section">
            <h6 className="privacy__section-title">
              Які персональні дані збираються
            </h6>
            <p className="privacy__section-info">
              1.1. Під час використання Веб-сайту Користувач може прийняти
              рішення про надання Адміністрації Веб-сайту певної інформації,
              заповнюючи онлайн-форми, реєструючись на Веб-сайті, роблячи
              замовлення, звертаючись до Адміністрації тощо. Видами персональних
              даних, які Користувач може надати, можуть бути, без обмеження,
              контактна інформація (адреса, електронна пошта, номер телефону,
              факсу та ін.), ім’я користувача і особисті вподобання, інтереси і
              використання різних продуктів і послуг, зміст комунікації з
              Адміністрацією Веб-сайту. Для доступу на Веб-сайт Користувач не
              зобов’язаний надавати перелічені вище персональні дані, проте в
              такому випадку деякі функції можуть бути йому недоступні.
            </p>
            <p className="privacy__section-info">
              1.2. Відразу після того, як Користувач зайшов на сайт,
              Адміністрація Веб-сайту може автоматично отримати деяку
              інформацію, яка може бути використана для його ідентифікації,
              наприклад, номер домену, IP адреса комп’ютера, вид
              використовуваного браузера, операційної системи і платформи,
              технічна інформація, інформація про географічне місцезнаходження
              під час відвідування Веб-сайту (тривалість перебування, популярні
              продукти, час відвідування сторінки, шляхи навігації, а також
              інформація про час, частоту і спосіб використання послуги та ін.).
              Адміністрація Веб-сайту може використовувати таку інформацію
              окремо або в сукупності, для технічного управління Веб-сайтом,
              аналітичної системи відстеження, досліджень і розробок.
            </p>
          </section>

          <section className="privacy__section">
            <h6 className="privacy__section-title">
              Обробка персональних даних
            </h6>
            <p className="privacy__section-info">
              2.1. Адміністрація Веб-сайту захищає персональні дані
              Користувачів, надаючи доступ до них тільки особам, які повинні
              мати до них доступ в зв’язку з належною реалізацією взаємовідносин
              між Адміністрацією та Користувачами, або особам, які з інших
              причин повинні виконувати дії, описані в даному розділі.
            </p>
            <p className="privacy__section-info">
              2.2. Адміністрація Веб-сайту може обробляти інформацію, яка
              вказана у профілі Користувача на Веб-сайті. Дані профілю можуть
              містити ім’я, адресу, номер телефону, електронної адреси, фото
              профілю, стать, дату народження, сімейний статус, інтереси і хобі,
              дані про освіту і місце роботи. Дані профілю можуть бути оброблені
              для надання Користувачу можливості використання та моніторингу
              Веб-сайту, придбання товарів та отримання послуг, створення
              особистого профілю Користувача і управління ним, роботи з
              Веб-сайтом, забезпечення безпеки Веб-сайту та послуг, резервного
              зберігання даних в базах і комунікації з Користувачами.
            </p>
            <p className="privacy__section-info">
              2.3. Адміністрація Веб-сайту може обробляти інформацію, яку
              Користувач публікує на Веб-сайті. Дані публікації можуть бути
              оброблені з метою вирішення питань, пов’язаних з публікацією або
              управління Веб-сайтом і послугами.
            </p>
            <p className="privacy__section-info">
              2.4. Адміністрація Веб-сайту може обробляти інформацію з запиту
              Користувача про товари/послуги. Дані запиту можуть бути оброблені
              з ціллю пропозиції, маркетингу та продажу відповідних
              товарів/послуг та для обробки окремих запитів Користувачів.
            </p>
            <p className="privacy__section-info">
              2.5. Адміністрація Веб-сайту може обробляти надану Користувачем
              інформацію з метою підписання його на електронні розсилки та / або
              інформаційні листи. Дані про повідомлення можуть оброблятися з
              метою відправки Користувачу відповідних повідомлень та / або
              інформаційних листів, інформації про товари, послуги і рекламних
              матеріалів. Після того, як Користувач підпишеться на розсилку на
              Веб-сайті, Адміністрація Веб-сайту направляє йому повідомлення на
              вказану електронну адресу для підтвердження. Якщо Користувач не
              підтвердить підписку, вона буде автоматично видалена. Користувач
              може в будь-який момент відкликати свою згоду на отримання
              розсилки.
            </p>
            <p className="privacy__section-info">
              2.6. Персональні дані обробляються відповідно до чинного
              законодавства України. Правова підстава такої обробки –
              забезпечення реалізації відносин у сфері охорони здоров’я,
              моніторинг та покращення роботи Веб-сайту та якості
              товарів/послуг.
            </p>
          </section>
        </div>
        
        <div className="privacy__questions">
          <Questions />
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
