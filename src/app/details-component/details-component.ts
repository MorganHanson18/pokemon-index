import { Component, ElementRef, inject, OnInit,} from '@angular/core';
import {ActivatedRoute} from '@angular/router'
import{PokemonDetails} from '../pokemon.interface'
import {PokemonsService} from '../pokemons.service'
import { RouterModule } from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './details-component.html',
  styleUrls: ['./details-component.css'],
})
export class DetailsComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  pokemonsService = inject(PokemonsService);
  pokemon?: PokemonDetails;
  id = this.route.snapshot.params['id'];
  chartData: any[] = [];

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    document.body.classList.add('details-page');
    this.pokemonsService.getPokemon(this.id).subscribe((response: PokemonDetails) => {
      this.pokemon = response;
      this.updateChartData();
      this.updateBackgroundColor();
    });
  }


  updateChartData(): void {
    if (this.pokemon) {
      this.chartData = this.pokemon.stats.map(stat => ({
        label: stat.stat.name,
        value: stat.base_stat
      }));
      this.createChart();
    }
  }

  getTypeColor(type: string): string {
    const typeColors: { [key: string]: string } = {
      normal: '#deccb4',
      fire: '#f5cdb8',
      water: '#dcdff7',
      electric: '#f5f2ae',
      grass: '#c5e3cc',
      ice: '#d5e8eb',
      fighting: '#f2b6b6',
      poison: '#ead1ed',
      ground: '#f5e0ae',
      flying: '#c5d9eb',
      psychic: '#ebbed1',
      bug: '#eaf7b5',
      rock: '#dbd6d0',
      ghost: '#c3b4d1',
      dragon: '#d1d5e6',
      dark: '#acacad',
      steel: '#a8aaad',
      fairy: '#f7d7f5'
    };
    return typeColors[type.toLowerCase()];
  }

  updateBackgroundColor(): void {
    if (this.pokemon && this.pokemon.types.length > 0) {
      const typeColor = this.getTypeColor(this.pokemon.types[0].type.name);
      this.elementRef.nativeElement.style.setProperty('background-color', typeColor);
    }
  }

  createChart(): void {
    const element = this.elementRef.nativeElement.querySelector('#chart');
    const width = 300;
    const height = 300;
    const radius = 150;
    const data = [
      { label: 'HP', value: this.getStat('hp') },
      { label: 'Attack', value: this.getStat('attack') },
      { label: 'Defense', value: this.getStat('defense') },
      { label: 'Special-attack', value: this.getStat('special-attack') },
      { label: 'Special-defense', value: this.getStat('special-defense') },
      { label: 'Speed', value: this.getStat('speed') }
    ];
    const total = this.getStat('hp') + this.getStat('attack') + this.getStat('defense') + this.getStat('special-attack') + this.getStat('special-defense') + this.getStat('speed');
    const customColors = ['#ff595a', '#f5ac78', '#fbe078', '#9db7f5', '#a7dc8d', '#fa92b3'];

    d3.select(element).select('svg').remove();

    const svg = d3.select("#chart")
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal<string>()
      .domain(data.map(d => d.label))
      .range(customColors);

    const pie = d3.pie<any>().value((d: any) => d.value).sort(null);

    const data_ready = pie(data);

    const arc = d3.arc<any>()
      .innerRadius(radius * 0.2)
      .outerRadius((d: { data: { value: number; }; }) => radius * (d.data.value / total *3.5));

    const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("font-family", "Open Sans, sans-serif");

      svg.selectAll('arc')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d: any) => color(d.data.label))
      .style("opacity", 1)
      .on("mouseover", function(event, d) {
        const currentColor = d3.color(color(d.data.label));
        if (currentColor) {
          d3.select(this)
            .transition()
            .attr('fill', currentColor.brighter(0.4).toString())
            .attr("transform", "scale(1.1)");
        }

        tooltip.transition()
          .style("opacity", 1);
        tooltip.html(d.data.label + " : " + d.data.value + ' (' + ((d.data.value / total) * 100).toFixed(2) + '%)')
          .style("left", (event.pageX + 5) + "px")
          .style("top", (event.pageY - 28) + "px")
          .style("border-color", color(d.data.label))
          .style("font-size", "14px")
          .style("color", "#797c7d");
      })
      .on("mouseout", function(event, d) {
        d3.select(this)
          .transition()
          .attr('d', arc)
          .attr('fill', color(d.data.label))
          .attr("transform", "scale(1)");

        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

  const legend = d3.select("#legend")
    .append("ul")
    .style("list-style", "none")
    .style("padding", 0)
    .style("display", "flex")
    .style("flex-wrap", "wrap");

  const legendItem = legend.selectAll("li")
    .data(data)
    .enter()
    .append("li")
    .style("display", "flex")
    .style("align-items", "center")
    .style("margin-right", "10px")
    .style("margin-bottom", "10px");


  legendItem.append("span")
  .style("display", "inline-block")
  .style("width", "25px")
  .style("height", "15px")
  .style("margin-right", "5px")
  .style("border-radius", "3px")
  .style("background-color", (d: any) => color(d.label));

legendItem.append("span")
  .text((d: any) => d.label);
  }

  getStat(statName: string): any {
    return this.pokemon?.stats.find(stat => stat.stat.name === statName)?.base_stat;
  }

}
