import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { withTheme } from '@material-ui/core/styles'

import Button from '../../../components/Button'
import LabelledValue from '../../../components/LabelledValue'

import Overview from '../../../components/Overview'
import OverviewSection from '../../../components/OverviewSection'
import Row from '../../../components/Row'
import TokenIcon from '../../../components/TokenIcon'

import BigNumber from 'bignumber.js';

import DashboardContext from '../context'

const StyledPoolTab = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`

const StyledBalance = styled.div`
  display: flex;
  flex: 1;
  font-size: 22px;
  font-family: Arial;
  justify-content: flex-end;
  text-align: right;
  @media (max-width: 512px) {
    font-size: 18px;
  }
  text-decoration: ${ props => props.moused ? 'underlined' : 'none' };
  color: ${ props => props.moused ? '#0000EE' : 'black' }
`

const StyledActions = withTheme(styled.div`
  align-items: center;
  background-color: ${props => props.theme.palette.grey[50]};
  display: flex;
  height: 80px;
  padding: 0 24px;
  @media (max-width: 512px) {
    padding: 0 12px;
  }
`)

const StyledRows = styled.div`
  margin-bottom: 12px;
`

const PoolName = styled.span`
  align-items: center;
  display: flex;
  flex: 1.5;
`
const PoolNamePart = styled.span`
  margin: 4px;
  padding-right: 8px;
  position: relative;
  &:after {
    content: "";
    height: 75%;
    width: .5px;
    background-color: black;
    position: absolute;
    right: 0;
    top: 5px;
  }
`

const PoolNamePartLast = styled.span`
  margin: 4px;
  position: relative;
`

const Symbol = styled.span`
  text-align: center;
  display: inline;
  width: 100%;
  font-size: 18px;
  text-decoration: ${ props => props.moused ? 'underlined' : 'none' };
  color: ${ props => props.moused ? '#0000EE' : 'black' };
`
const Weight = styled.span`
  text-align: center;
  display: block;
  width: 100%;
  font-size: 12px;
  text-decoration: ${ props => props.moused ? 'underlined' : 'none' };
  color: ${ props => props.moused ? '#0000EE' : 'grey' };
`

function useHover() {
  const [value, setValue] = useState(false);

  const ref = useRef(null);

  const handleMouseOver = () => (console.log("moused over"), setValue(true));
  const handleMouseOut = () => (console.log("moused out"), setValue(false));

  useEffect(
    () => {
      const node = ref.current;
      if (node) {
        node.addEventListener('mouseover', handleMouseOver);
        node.addEventListener('mouseout', handleMouseOut);

        return () => {
          node.removeEventListener('mouseover', handleMouseOver);
          node.removeEventListener('mouseout', handleMouseOut);
        };
      }
    },
    [ref.current] // Recall only if ref changes
  );

  return [ref, value];
}

const PoolsTab = () => {
  
  const {
    presentPool,
    engine,
    state
  } = useContext(DashboardContext)

  let hovers = []
  let rows = []

  if (state.has('shells')) {
    for (let i = 0; i < engine.shells.length; i++) {
      let liqTotal = state.getIn(['shells',i,'shell','liquidityTotal','display'])
      rows.push(<PoolRow assets={engine.shells[i].assets} liqTotal={liqTotal}/>)
    }
  }

  return (
    <StyledPoolTab>
      {/* <Overview>
      </Overview> */}
      <StyledRows>
        <Row head>
          <span style={{ flex: 1.5 }}> Pools </span>
          <span style={{ flex: 1, textAlign: 'right' }}> Size </span>
          <span style={{ flex: 1, textAlign: 'right' }}> APY </span>
        </Row>
        { rows }
      </StyledRows>
    </StyledPoolTab>
  )
}

const PoolRow = ({liqTotal, assets}) => {
  console.log("liq total", liqTotal)
  console.log("assets", assets)

  const useHover = () => {
    const [hovered, setHovered] = useState()
    const handlers = useMemo(() => ({
      onMouseOver(){ setHovered(true) },
      onMouseOut(){ setHovered(false) }
    }),[])
    return [hovered, handlers]
  }

  const [ hovered, handlers ] = useHover()
  
  const name = getName(assets)

  function getName (assets) {

    const parts = assets.map( (a,i) => {

      if (i == assets.length - 1) {
        
        return (
          <PoolNamePartLast>
            <Symbol moused={hovered}>
              { a.symbol }
            </Symbol>
            <Weight moused={hovered}>
              { a.weight.multipliedBy(new BigNumber(100)).toString() + '%' }
            </Weight>
          </PoolNamePartLast>
        )

      } else {

        return (
          <PoolNamePart>
            <Symbol moused={hovered}>
              { a.symbol }
            </Symbol>
            <Weight moused={hovered}>
              { a.weight.multipliedBy(new BigNumber(100)).toString() + '%' }
            </Weight>
          </PoolNamePart>
        )

      }

    })

    return (
      <PoolName>
        {parts}
      </PoolName>
    )

  }

  return (
    <Row {...handlers} style={{cursor:'pointer'}}>
      {name}
      <StyledBalance className="number" moused={hovered}> { liqTotal } </StyledBalance>
      <StyledBalance className="number" moused={hovered}> 100% </StyledBalance>
    </Row>
  )

}

export default PoolsTab