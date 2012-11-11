//
//  RunLoopDelegate.cpp
//  hybridge
//
//  Created by The Narrator on 10/27/12.
//
//

#include "RunLoopDelegate.h"
#include "dev/HGEPlatformMacros.h"
#include "platform/nacl/hybrid/CCHybridEGLView.h"
#include "cocos2d.h"






#include "service/HGEAPI.h"
#include "service/HGESuperior.h"
#include "service/HGEGate.h"
#include "service/HGERouter.h"

#include "graphics/HGECCFabric.h"
#include "graphics/HGECCNexus.h"
#include "graphics/HGECCPixie.h"
#include "graphics/HGECCZone.h"
#include "graphics/HGECCScape.h"
#include "graphics/HGECCTroop.h"

NS_HGE_BEGIN

class HGEImplementationSpawner : public HGERouter::SpawnerInterface {
public:
	HGEImplementationSpawner() {}
	~HGEImplementationSpawner() {}
	
	virtual HGECanRout<>::Magic * generate(const char* type,
										 JSONValue& json,
										 HGEBottomLevelDomainName bldn,
										 HGEPortNumber port,
										 HGERouter * router,
										 HGERouter::BottomLevelNameServerInterface * dns) {
		HGECanRout<>::Magic * result = 0;
		HGECanImp<>::Magic<> * concrete = 0;
		if (!type) {
		} else if (0 == strcmp(type, "Pixie")) {
			HGECCPixie * obj = new HGECCPixie(router, dns);
			if (obj->canYou(HGE_LIKEA(HGECanRout), &concrete, 0)) {
				result = static_cast< HGECanRout<>::Magic * >(concrete);
			} else {
				HGEDelete(obj);
			}
		} else if (0 == strcmp(type, "Nexus")) {
			HGECCNexus * obj = new HGECCNexus(router, dns);
			if (obj->canYou(HGE_LIKEA(HGECanRout), &concrete, 0)) {
				result = static_cast< HGECanRout<>::Magic * >(concrete);
			} else {
				HGEDelete(obj);
			}
		} else if (0 == strcmp(type, "Zone")) {
			HGECCZone * obj = new HGECCZone(bldn, port, router, dns);
			if (obj->canYou(HGE_LIKEA(HGECanRout), &concrete, 0)) {
				result = static_cast< HGECanRout<>::Magic * >(concrete);
			} else {
				HGEDelete(obj);
			}
		} else if (0 == strcmp(type, "Scape")) {
			HGECCScape * obj = new HGECCScape(router, dns);
			if (obj->canYou(HGE_LIKEA(HGECanRout), &concrete, 0)) {
				result = static_cast< HGECanRout<>::Magic * >(concrete);
			} else {
				HGEDelete(obj);
			}
		} else if (0 == strcmp(type, "Fabric")) {
			HGECCFabric * obj = new HGECCFabric(bldn, port, router);
			if (obj->canYou(HGE_LIKEA(HGECanRout), &concrete, 0)) {
				result = static_cast< HGECanRout<>::Magic * >(concrete);
			} else {
				HGEDelete(obj);
			}
		} else if (0 == strcmp(type, "Troop")) {
			HGECCTroop * obj = new HGECCTroop(router, dns);
			if (obj->canYou(HGE_LIKEA(HGECanRout), &concrete, 0)) {
				result = static_cast< HGECanRout<>::Magic * >(concrete);
			} else {
				HGEDelete(obj);
			}
		}
		return result;
	}
};

NS_HGE_END

USING_NS_HGE;
USING_NS_CC;

RunLoopDelegate::RunLoopDelegate(pp::Instance* instance) : HGEPlatformRunLoop(instance)
{
}

RunLoopDelegate::~RunLoopDelegate()
{
}

void RunLoopDelegate::begin()
{
	HGERunLoop::sharedRunLoop()->setInterval(1.0 / 60);
	
    CCApplication::sharedApplication()->run();
}

void RunLoopDelegate::update()
{
	cocos2d::CCDirector::sharedDirector()->mainLoop();
}

void RunLoopDelegate::present()
{
	pp::CompletionCallback cc = m_obFactory.NewCallback(&HGEPlatformRunLoop::threadCycle);
	CCHybridEGLView::sharedHybridOpenGLView()->hybridPresentation(cc);
	//[[EAGLView sharedEGLView] hybridPresentation];
}

HGEAPI * RunLoopDelegate::attach(void * client) {
	
	HGESuperior * superior = new HGESuperior(HGE_KEYTEXT_SERVICE_SUPERIOR);
	
	bool doubleBuffered = false;
	
	HGEGate * gate = new HGEGate(HGE_KEYTEXT_SERVICE_GATE, doubleBuffered);
	
	HGERouter::TableInterface * table = new HGERouter::Table();
	
	HGERouter::BottomLevelNameServerInterface * dns = new HGERouter::BottomLevelNameServer(table);
	
	HGERouter::SpawnerInterface * spawner = new HGEImplementationSpawner();
	
	HGERouter * router = new HGERouter(HGE_KEYTEXT_SERVICE_ROUTER, table, dns, spawner);
	
	superior->assignAssistant(gate);
	
	superior->gainWorker(router);
	
	HGEAPIWorker * interface = new HGEAPIWorker(client, superior);
	
	return interface;
}


