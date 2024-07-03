import { Component, ElementRef, inject, OnInit,} from '@angular/core';
import {ActivatedRoute} from '@angular/router'
import{Pokemon, PokemonDetails} from '../pokemon.interface'
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

  createChart(): void {
    const element = this.elementRef.nativeElement.querySelector('#chart');
    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;
    const data = [
      { label: 'hp', value: this.getStat('hp') },
      { label: 'attack', value: this.getStat('attack') },
      { label: 'defense', value: this.getStat('defense') },
      { label: 'special-attack', value: this.getStat('special-attack') },
      { label: 'special-defense', value: this.getStat('special-defense') },
      { label: 'speed', value: this.getStat('speed') }
    ];

    d3.select(element).select('svg').remove();

    const svg = d3.select("#chart")
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal<string>()
      .domain(data.map(d => d.label))
      .range(d3.schemeTableau10);

    const pie = d3.pie<any>().value((d: any) => d.value);

    const data_ready = pie(this.chartData);

    const arc = d3.arc<any>()
      .innerRadius(radius * 0.2)
      .outerRadius((d: { data: { value: number; }; }) => radius * (d.data.value / 100));

      svg.selectAll('arc')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d: any) => color(d.data.label))
      .style("opacity", 0.7);

    svg
      .selectAll('text')
      .data(data_ready)
      .attr('transform', (d: any) => `translate(${arc.centroid(d)})`)
      .style('text-anchor', 'middle')
      .style('font-size', 14);

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
    .style("width", "12px")
    .style("height", "12px")
    .style("margin-right", "5px")
    .style("background-color", (d: any) => color(d.label));

  legendItem.append("span")
    .text((d: any) => d.label);
  }




  getStat(statName: string): any {
    return this.pokemon?.stats.find(stat => stat.stat.name === statName)?.base_stat;
  }
}
