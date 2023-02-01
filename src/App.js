import React, { useState, useEffect } from 'react';
import './App.css';
import Moment from 'react-moment';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button,Table,Input} from 'reactstrap';

function App() {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [sortAsc, setSortAsc] = useState(true);
  const [filterValue, setFilterValue] = useState('all');
  const [filteredCompany, setFilteredCompany] = useState([]);

  //fetch data from API
  useEffect(() => {
    fetch('https://my-json-server.typicode.com/capcito/frontend-ws/companies')
      .then(response => response.json())
      .then(data => setCompanies(data))
  }, []);


 //handle search and filter
  useEffect(()=>{
    if(filterValue!=="all"){
      //filter company according to filterValue
      setFilteredCompany(companies.filter(company=>company.type===filterValue)) 
    }
    else {
      setFilteredCompany(companies)  
    }

    //filter filteredCompany to return items that contain searchItem, set as rearchResult
    setSearchResult(
      filteredCompany.filter((company)=>   
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    //console.log(filteredCompany)
 
  }
  ,[filterValue,companies,searchTerm,filteredCompany])

//toggle sort, ascending or sescending
const handleSort = () => {
  setSortAsc(!sortAsc);
  //console.log(sortAsc)
};

//create compare function, in ascending order
function compareAsc( a, b ) {
  if ( a.name < b.name ){
    return -1;
  }
  if ( a.name > b.name ){
    return 1;
  }
  return 0;
}

//sort the searchResult to get sortedCompanies, in ascending or descending order
const sortedCompanies = sortAsc? searchResult.sort(compareAsc):searchResult.sort(compareAsc).reverse()


  return (
    <div className="App">
      <div className="search-bar">
      <Input type="text" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="search by company name"/>
      <Input  type="select"  value={filterValue} onChange={(e)=>setFilterValue(e.target.value)} >
       <option value="all">Show all types</option>
       <option value="AB">AB</option>
       <option value="EF">EF</option>
       <option value="HB">HB</option>
      </Input>

      <Button color="primary" onClick={handleSort} style={{minWidth:"200px"}}>
        Sort by Name ({sortAsc ? 'Ascending' : 'Descending'})
      </Button>   
      </div>

      {sortedCompanies =="" ? <Table>No result Found!</Table> :
      <Table className="table">  
        <thead>
          <tr>
            <th>ID</th>
            <th>Company Name</th>
            <th>Type</th>
            <th>Incorporation Date</th>
          </tr>
        </thead>
        <tbody>{sortedCompanies.sort().map(company => (
            <tr key={company.id}>
              <td>{company.id}</td>
              <td>{company.name}</td>
              <td>{company.type}</td>
              <td><Moment format="YYYY/MM/DD">{company.created_at}</Moment></td>
            </tr>
          )) }
        </tbody>            
      </Table>}
    </div>
  );
}

export default App
