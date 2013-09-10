// Copyright (c) 2013 Marcos Torres, Grupo de Sistemas Inteligentes - Universidad Politécnica de Madrid. (GSI-UPM)
//  http://www.gsi.dit.upm.es/
//
//  All rights reserved. This program and the accompanying materials
//  are made available under the terms of the GNU Public License v2.0
//  which accompanies this distribution, and is available at
//
//  http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
//
//  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and  limitations under the License.
 
// New widget
var widgetD3 = {
		// Widget name.
		name: "Gráfico de barras con d3.js",
		// Widget description.
		description: "Representa el campo seleccionado en un gráfico de barras.",
		// Path to the image of the widget.
		img: "img/barchartD3.png",
		// Type of the widget.
		type: "barchartD3",
		// [OPTIONAL] data taken from this field.
		field: "hasPolarity",

		render: function () {
			var id = 'D3' + Math.floor(Math.random() * 10001);
			var field = widgetD3.field || "";
			vm.activeWidgetsLeft.push({"id":ko.observable(id),"title": ko.observable(widgetD3.name), "type": ko.observable(widgetD3.type), "field": ko.observable(field),"collapsed": ko.observable(false)});
			
			widgetD3.paint(field, id, widgetD3.type);
		},

		paint: function (field, id, type) {
			var t = ko.utils.getDataColumns(field);
	
			if(t==undefined){
				vm.newWidgetGetData(field, id);
			}else{

				d3.select('#'+id).select('svg').remove();

				for (var i = 0; i < t.length; i++) {
					t[i].facet = t[i].facet.substring(24);			//t[i].facet.indexOf('#') + 1);
				}
  			 
				console.log(t);

				var margin = {top: 20, right: 20, bottom: 30, left: 50},
    				width  = 470 - margin.left - margin.right,
   					height = 400 - margin.top - margin.bottom;

				var formatPercent = d3.format(".0%");

				var x = d3.scale.ordinal()
   						.rangeRoundBands([0, width], .1);

				var y = d3.scale.linear()
    					.range([height, 0]);

				var xAxis = d3.svg.axis()
	    			.scale(x)
    				.orient("bottom");

				var yAxis = d3.svg.axis()
    				.scale(y)
    				.orient("left");

				var svg = d3.select('#'+id).append("svg")
	    			.attr("width", width + margin.left + margin.right)
    				.attr("height", height + margin.top + margin.bottom)
  					.append("g")
    				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   				var data = t;
	  			
  				
  				if ((field == "hasPolarity") || (field == "has_creator") ) {
	  				x.domain(data.map(function(d) { return (d.facet) }));
  				} else {
	  				x.domain(data.map(function(d) { return d3.format('.2f')(d.facet) }));
  				}
	  			
  				//x.domain(data.map(function(d) { return (d.facet) }));
 				y.domain([0, Math.ceil(d3.max(data, function(d) { return d.count; })/10)*10]);
	  			
  				svg.append("g")
	     			.attr("class", "x axis")
     				.attr("transform", "translate(0," + height + ")")
     				.call(xAxis)
				
				svg.append("g")
	     			.attr("class", "y axis")
     				.call(yAxis)
   					.append("text")
	     			.attr("transform", "rotate(-90)")
     				.attr("y", 6)
     				.attr("dy", ".71em")
     				.style("text-anchor", "end");
	  			
  				svg.selectAll(".bar")
	   				.data(data)
    				.enter().append("rect")
      				.attr("class", "bar")
      				.attr("x", function(d) { return x(d.facet); })
      				.attr("width", x.rangeBand())
	      			.attr("y", function(d) { return y(d.count); })
      				.attr("height", function(d) { return height - y(d.count); });
			}
		}
		
	};