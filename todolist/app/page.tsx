
import ListContainer from "./components/ListContainer/ListContainer";

export default function Home() {

  const dateString = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="page__wrapper">
      <div className="page__header">
        <h1 className="page__header-title">TO<span>DO</span></h1>
        <span className="page__header-date">{dateString}</span>
      </div>
      <ListContainer />
    </div>
  );
}
