import React from 'react';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);

    // State of your application
    this.state = {
      modifiedData: {
        name: '',
        description: '',
        categories: [],
      },
      allCategories: [],
      error: null,
    };
  }

  // Fetch your categories immediately after the component is mounted
  componentDidMount = async () => {
    try {
      const response = await axios.get('http://40.79.253.64:1337/categories');
      this.setState({ allCategories: response.data });
      console.log("Categories data : ",response.data);
    } catch (error) {
      this.setState({ error });
      console.log("Error in Categories fetching : ",error);
    }
  };

  handleInputChange = ({ target: { name, value } }) => {
    this.setState(prev => ({
      ...prev,
      modifiedData: {
        ...prev.modifiedData,
        [name]: value,
      },
    }));
  };

  handleSubmit = async e => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://40.79.253.64:1337/restaurants',
        this.state.modifiedData
      );
      console.log("Creating a new restaurant : ",response);
    } catch (error) {
      this.setState({ error });
    }
  };

  renderCheckbox = category => {
    const {
      modifiedData: { categories },
    } = this.state;
    const isChecked = categories.includes(category.id);
    const handleChange = () => {
      if (!categories.includes(category.id)) {
        this.handleInputChange({
          target: { name: 'categories', value: categories.concat(category.id) },
        });
      } else {
        this.handleInputChange({
          target: {
            name: 'categories',
            value: categories.filter(v => v !== category.id),
          },
        });
      }
    };

    return (
      <div key={category.id}>
        <label htmlFor={category.id}>{category.name}</label>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          name="categories"
          id={category.id}
        />
      </div>
    );
  };

  render() {
    const { error, allCategories, modifiedData } = this.state;

    // Print errors if any
    if (error) {
      return <div>An error occured: {error.message}</div>;
    }

    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <h3>Restaurants</h3>
          <br />
          <label>
            Name:
            <input
              type="text"
              name="name"
              onChange={this.handleInputChange}
              value={modifiedData.name}
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              name="description"
              onChange={this.handleInputChange}
              value={modifiedData.description}
            />
          </label>
          <div>
            <br />
            <b>Select categories</b>
            {allCategories.map(this.renderCheckbox)}
          </div>
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default App;