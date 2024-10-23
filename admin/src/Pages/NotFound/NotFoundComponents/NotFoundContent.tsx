import './NotFound.scss'

const NotFoundContent: React.FC = () => {
  return (
    <>
    <h1 className="title">
      Такої сторінки не існує ;(
    </h1>
    <a href="/" className="login">Увійти</a>
    
    </>
  )   
};

export default NotFoundContent;