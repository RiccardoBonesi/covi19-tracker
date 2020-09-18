import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DateWiseData } from 'src/app/models/date-wise-data';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  data : GlobalDataSummary[];
  countries : string[] = [];
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  selectedCountryData : DateWiseData[]; 
  dateWiseData ;
  loading = true;
  options: {
    height : 500, 
    animation:{
      duration: 1000,
      easing: 'out',
    },
  }

  

  chart = {
    PieChart : "PieChart" ,
    ColumnChart : 'ColumnChart' ,
    LineChart : "LineChart", 
    height: 500, 
    options: {
      animation:{
        duration: 1000,
        easing: 'out',
      },
      is3D: false
    }  
  }

  dataTable = []
 
  constructor(private service : DataServiceService) { }

  ngOnInit(): void {

    merge(
      this.service.getDateWiseData().pipe(
        map(result=>{
          this.dateWiseData = result;
        })
      ), 
      this.service.getGlobalData().pipe(map(result=>{
        this.data = result;
        console.log(this.data)
        this.data.forEach(cs=>{
          this.countries.push(cs.country)
        })
        console.log(this.countries)
      }))
    ).subscribe(
      {
        complete : ()=>{
         this.updateValues('US')
         this.loading = false;
        }
      }
    )
    
    

  }

  updateChart(){
    this.dataTable = [];
    // this.dataTable.push(["Date" , 'Cases'])
    this.selectedCountryData.forEach(cs=>{
      this.dataTable.push([cs.date , cs.cases])
    })

   
  }

  updateValues(country : string){
    console.log(country);
    this.data.forEach(cs=>{
      if(cs.country == country){
        this.totalActive = cs.active
        this.totalDeaths = cs.deaths
        this.totalRecovered = cs.recovered
        this.totalConfirmed = cs.confirmed
      }
    })

    this.selectedCountryData  = this.dateWiseData[country]
    this.updateChart();
    
  }




  title = 'Average Temperatures of Cities';
   type = 'LineChart';
   mydata = [
      ["Jan",  7.0, -0.2, -0.9, 3.9],
      ["Feb",  6.9, 0.8, 0.6, 4.2],
      ["Mar",  9.5,  5.7, 3.5, 5.7],
      ["Apr",  14.5, 11.3, 8.4, 8.5],
      ["May",  18.2, 17.0, 13.5, 11.9],
      ["Jun",  21.5, 22.0, 17.0, 15.2],
      ["Jul",  25.2, 24.8, 18.6, 17.0],
      ["Aug",  26.5, 24.1, 17.9, 16.6],
      ["Sep",  23.3, 20.1, 14.3, 14.2],
      ["Oct",  18.3, 14.1, 9.0, 10.3],
      ["Nov",  13.9,  8.6, 3.9, 6.6],
      ["Dec",  9.6,  2.5,  1.0, 4.8]
   ];
   columnNames = ["Month", "Tokyo", "New York","Berlin", "Paris"];
   myoptions = {   
      hAxis: {
         title: ''
      },
      vAxis:{
         title: 'Total cases'
      },
      chartArea: {'width': '80%', 'height': '80%'},
      legend: {position: 'none'}
   };
   width = 550;
   height = 400;

}