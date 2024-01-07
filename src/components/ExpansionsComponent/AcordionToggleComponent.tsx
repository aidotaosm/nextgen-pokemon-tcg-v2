'use client'
import { AppContext } from "@/contexts/AppContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect } from "react";

export const AcordionToggleComponent = ({
  setsBySeries,
  setSetsBySeries,
}: {
  setsBySeries: any[];
  setSetsBySeries: (e: any[]) => void;
}) => {
  const { updateGlobalSearchTerm, appState } = useContext(AppContext);
  const queryParams = useSearchParams();
  let router = useRouter();
  useEffect(() => {
    // let arrayOfSets:any[] = [];
    // arrayOfSeries.forEach((x: any) => { arrayOfSets.push(...x.sets) });
    // const xmlText = Helper.generateSiteMap(arrayOfSets, Vercel_DEFAULT_URL + 'set/');
    // console.log(arrayOfSets);
    // Helper.saveTemplateAsFile(
    //   "sitemap.xml",
    //   xmlText,
    //   false,
    //   "text/plain"
    // );
    if (appState?.bootstrap) {
      let selectedSeriesId = queryParams?.get("opened-series");
      let parentOfAccordionToOpen = document.getElementById(
        selectedSeriesId || ""
      );
      if (parentOfAccordionToOpen && selectedSeriesId !== setsBySeries[0].id) {
        const latestSetAccordion = document.getElementById(setsBySeries[0].id)
          ?.children[0].children[0] as HTMLElement;
        latestSetAccordion?.click();
        const accordionToOpen = parentOfAccordionToOpen.children[0]
          .children[0] as HTMLElement;
        accordionToOpen?.click();
        setTimeout(() => {
          parentOfAccordionToOpen?.scrollIntoView({
            behavior: "smooth",
            inline: "start",
            block: "start",
          });
        }, 500);
        setsBySeries.forEach((series) => {
          if (series.id === selectedSeriesId) {
            series.isOpen = true;
          } else {
            series.isOpen = false;
          }
        });
        setSetsBySeries([...setsBySeries]);
        console.log(setsBySeries);
      } else {
        //window.history.pushState({}, '', "/series?opened-series=" + setsBySeries[0]?.id)
        router.push("/series?opened-series=" + setsBySeries[0]?.id);
      }
    }
  }, [appState?.bootstrap]);
  return <></>;
};
