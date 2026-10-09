// Components available in every diary entry's MDX without an import.
import ReportClipping from "../site/ReportClipping.astro";
import Bars from "./Bars.astro";
import Card from "./Card.astro";
import Data from "./Data.astro";
import KeyPoints from "./KeyPoints.astro";
import Note from "./Note.astro";
import Stats from "./Stats.astro";

export const articleComponents = { Report: ReportClipping, Note, Stats, Bars, Card, Data, KeyPoints };
