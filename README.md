# MRT_line-chart
project:高雄捷運票卡種類分析
由於從2016年7月份開始，高雄捷運開放使用悠遊卡，
想藉此看出悠遊卡的加入是否會對運量有整體的上升，又或是大幅的改變種類分布。

#由於2011年以及2012年沒有詳細的票種數目，所以目前先將總量放入一卡通的位置來代替

rules:
1.2016年7月以前，非單程、一日、其他、團體票，一概算入"一卡通"
2.2008年11月前，"其它"並未分出，算入單程票中

需要修改部分:
1.將buttons改用slider(時間軸)來呈現

資料來源:
http://kcgdg.kcg.gov.tw/kcgstat/page/kcg01_1.aspx?Mid=3024&p=2&y=103&m=1
http://mtbu.kcg.gov.tw/cht/info_statistics_month.php
