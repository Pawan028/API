import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Welcome To EcoMart',
  description: 'Your one-stop shop for fresh and organic groceries!',
  keywords: 'Experience the best quality and service!',
};

export default Meta;
