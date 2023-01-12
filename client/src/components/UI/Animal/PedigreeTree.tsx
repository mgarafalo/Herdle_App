import { INode, ReactHiererchyChart } from "react-hierarchy-chart";
import { Animal } from "../../../Interfaces/Animal";

interface Props {
  animal: Animal;
}

interface ChartItem extends INode {
  name: string;
  registrationNumber: string;
  childs?: ChartItem[];
}

export default function PedigreeTree() {
  const pedigreeData: ChartItem[] = [
    {
      name: "Candy Apple",
      cssClass: "level1",
      registrationNumber: "1",
      childs: [
        {
          name: "Sequoia",
          cssClass: "level2",
          registrationNumber: "2",
          childs: [
            {
              name: "Indian Outlaw",
              cssClass: "level3",
              registrationNumber: "3",
              childs: [
                {
                  name: "Outlaw",
                  cssClass: "level4",
                  registrationNumber: "4",
                  childs: [
                    {
                      name: "Sonny Boy",
                      cssClass: "level5",
                      registrationNumber: "5",
                    },
                    {
                      name: "Saphire",
                      cssClass: "level5",
                      registrationNumber: "5",
                    },
                  ],
                },
                {
                  name: "Litas Girl",
                  cssClass: "level4",
                  registrationNumber: "4",
                  childs: [
                    {
                      name: "Blockbuster",
                      cssClass: "level5",
                      registrationNumber: "5",
                    },
                  ],
                },
              ],
            },
            {
              name: "Donna",
              cssClass: "level3",
              registrationNumber: "3",
              childs: [
                {
                  name: "Roho Grande",
                  cssClass: "level4",
                  registrationNumber: "4",
                  childs: [
                    {
                      name: "Rusty",
                      cssClass: "level5",
                      registrationNumber: "5",
                    },
                    {
                      name: "P77",
                      cssClass: "level5",
                      registrationNumber: "5",
                    },
                  ],
                },
                {
                  name: "Billie Jean",
                  cssClass: "level4",
                  registrationNumber: "4",
                  childs: [
                    {
                      name: "Conquistador",
                      cssClass: "level5",
                      registrationNumber: "5",
                    },
                    {
                      name: "Vicky Jean",
                      cssClass: "level5",
                      registrationNumber: "5",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Lovers Pie",
          cssClass: "level2",
          registrationNumber: "2",
          childs: [
            {
              name: "Top Gun",
              cssClass: "level3",
              registrationNumber: "3",
              childs: [
                {
                  name: "Silver Back",
                  cssClass: "level3",
                  registrationNumber: "3",
                  childs: [
                    {
                      name: "Larrys Vision",
                      cssClass: "level5",
                      registrationNumber: "5",
                    },
                    {
                      name: "R224",
                      cssClass: "level5",
                      registrationNumber: "5",
                    },
                  ],
                },
                {
                  name: "Y17",
                  cssClass: "level3",
                  registrationNumber: "3",
                  childs: [
                    {
                      name: "Larrys Vision",
                      cssClass: "level5",
                      registrationNumber: "5",
                    },
                    {
                      name: "Jemima",
                      cssClass: "level5",
                      registrationNumber: "5",
                    },
                  ],
                },
              ],
            },
            {
              name: "Punkin Pie",
              cssClass: "level3",
              registrationNumber: "3",
              childs: [
                {
                  name: "Achak",
                  cssClass: "level4",
                  registrationNumber: "4",
                  childs: [
                    {
                      name: "Sports Kat",
                      cssClass: "level5",
                      registrationNumber: "5",
                    },
                    {
                      name: "Xanthe",
                      cssClass: "level5",
                      registrationNumber: "5",
                    },
                  ],
                },
                {
                  name: "Aello",
                  cssClass: "level4",
                  registrationNumber: "4",
                  childs: [
                    {
                      name: "Nicks Flash",
                      cssClass: "level5",
                      registrationNumber: "5",
                    },
                    {
                      name: "Flower",
                      cssClass: "level5",
                      registrationNumber: "5",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  return (
    <>
      <ReactHiererchyChart
        nodes={pedigreeData}
        direction="horizontal"
        randerNode={(node: ChartItem) => (
          <div className="node-template">
            <span>{node.name}</span>
            <span>{node.registrationNumber}</span>
          </div>
        )}
      />
    </>
  );
}
