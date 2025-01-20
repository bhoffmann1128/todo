
import ListContainer from "./components/ListContainer/ListContainer";

export default function Home() {
  return (
    <div className="page__wrapper">
      <div className="page__header">
        <h1>TODO LIST</h1>
      </div>
      <ListContainer />
    </div>
  );
}
